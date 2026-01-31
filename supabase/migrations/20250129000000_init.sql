-- =============================================================
-- PlanLike 初期マイグレーション
-- テーブル / インデックス / トリガー / RLS ポリシー / Storage
-- =============================================================

-- =====================
-- 0. 拡張
-- =====================
create extension if not exists "pgcrypto";

-- =====================
-- 1. profiles
-- =====================
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  username   text not null unique,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- auth.users に行が作られたら profiles を自動生成
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'user_' || left(new.id::text, 8))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- updated_at 自動更新トリガー
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at();

-- =====================
-- 2. hirobas
-- =====================
create table public.hirobas (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_hirobas_owner on public.hirobas(owner_id);

create trigger hirobas_updated_at
  before update on public.hirobas
  for each row
  execute function public.update_updated_at();

-- =====================
-- 3. hiroba_members（多対多）
-- =====================
create table public.hiroba_members (
  hiroba_id  uuid not null references public.hirobas(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  role       text not null default 'member' check (role in ('owner', 'member')),
  status     text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  invited_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (hiroba_id, user_id)
);

create index idx_hiroba_members_user on public.hiroba_members(user_id);

-- =====================
-- 4. posts
-- =====================
create table public.posts (
  id          uuid primary key default gen_random_uuid(),
  hiroba_id   uuid not null references public.hirobas(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  image_path  text not null,
  caption     text,
  likes_count integer not null default 0,
  created_at  timestamptz not null default now()
);

create index idx_posts_hiroba on public.posts(hiroba_id, created_at desc);

-- =====================
-- 5. plans
-- =====================
create table public.plans (
  id              uuid primary key default gen_random_uuid(),
  hiroba_id       uuid not null references public.hirobas(id) on delete cascade,
  created_by      uuid not null references public.profiles(id) on delete cascade,
  name            text not null,
  summary         text,
  route_json      jsonb not null default '{}',
  source_post_ids uuid[] not null default '{}',
  status          text not null default 'draft' check (status in ('draft', 'selected')),
  created_at      timestamptz not null default now()
);

create index idx_plans_hiroba on public.plans(hiroba_id);

-- 1つの広場に selected は最大1件
create unique index idx_plans_one_selected
  on public.plans(hiroba_id)
  where (status = 'selected');

-- =============================================================
-- RLS ポリシー
-- =============================================================

-- ---------------------
-- ヘルパー: 認証ユーザーが広場の approved メンバーか判定
-- ---------------------
create or replace function public.is_hiroba_member(p_hiroba_id uuid)
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.hiroba_members
    where hiroba_id = p_hiroba_id
      and user_id  = auth.uid()
      and status   = 'approved'
  );
$$;

-- ---------------------
-- profiles
-- ---------------------
alter table public.profiles enable row level security;

create policy "profiles: 認証済みユーザーは全件閲覧可"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles: 本人のみ INSERT"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

create policy "profiles: 本人のみ UPDATE"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles: 本人のみ DELETE"
  on public.profiles for delete
  to authenticated
  using (id = auth.uid());

-- ---------------------
-- hirobas
-- ---------------------
alter table public.hirobas enable row level security;

create policy "hirobas: approved メンバーのみ閲覧"
  on public.hirobas for select
  to authenticated
  using (public.is_hiroba_member(id));

create policy "hirobas: 認証済みユーザーが作成可"
  on public.hirobas for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "hirobas: owner のみ更新"
  on public.hirobas for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "hirobas: owner のみ削除"
  on public.hirobas for delete
  to authenticated
  using (owner_id = auth.uid());

-- ---------------------
-- hiroba_members
-- ---------------------
alter table public.hiroba_members enable row level security;

-- SELECT: 同じ広場のメンバー or 自分の行
create policy "hiroba_members: メンバー同士閲覧可"
  on public.hiroba_members for select
  to authenticated
  using (
    user_id = auth.uid()
    or public.is_hiroba_member(hiroba_id)
  );

-- INSERT: 広場の owner または approved メンバーが招待可能
create policy "hiroba_members: メンバー招待"
  on public.hiroba_members for insert
  to authenticated
  with check (
    -- 自分自身を owner として登録（広場作成時）
    (user_id = auth.uid() and role = 'owner' and status = 'approved')
    -- または既存メンバーによる招待
    or public.is_hiroba_member(hiroba_id)
  );

-- UPDATE: 自分の行の status 更新（承認/拒否）、または owner による role/status 更新
create policy "hiroba_members: ステータス更新"
  on public.hiroba_members for update
  to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1
      from public.hiroba_members
      where hiroba_id = hiroba_members.hiroba_id
        and user_id  = auth.uid()
        and role     = 'owner'
        and status   = 'approved'
    )
  );

-- ---------------------
-- posts
-- ---------------------
alter table public.posts enable row level security;

create policy "posts: 広場メンバーのみ閲覧"
  on public.posts for select
  to authenticated
  using (public.is_hiroba_member(hiroba_id));

create policy "posts: 広場メンバーのみ投稿"
  on public.posts for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and public.is_hiroba_member(hiroba_id)
  );

create policy "posts: 投稿者のみ更新"
  on public.posts for update
  to authenticated
  using (user_id = auth.uid());

create policy "posts: 投稿者のみ削除"
  on public.posts for delete
  to authenticated
  using (user_id = auth.uid());

-- ---------------------
-- plans
-- ---------------------
alter table public.plans enable row level security;

create policy "plans: 広場メンバーのみ閲覧"
  on public.plans for select
  to authenticated
  using (public.is_hiroba_member(hiroba_id));

create policy "plans: 広場メンバーのみ作成"
  on public.plans for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and public.is_hiroba_member(hiroba_id)
  );

-- UPDATE: 作成者 または 広場 owner（両方許可する設計を採用）
create policy "plans: 作成者または owner が更新"
  on public.plans for update
  to authenticated
  using (
    created_by = auth.uid()
    or exists (
      select 1
      from public.hirobas
      where id       = plans.hiroba_id
        and owner_id = auth.uid()
    )
  );

-- =============================================================
-- Storage: post-images バケット
-- =============================================================
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', false);

-- Storage ポリシー: approved メンバーのみ read/write
-- パス規約: hirobas/{hiroba_id}/{user_id}/{filename}
create policy "storage: メンバーのみ閲覧"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'post-images'
    and public.is_hiroba_member((storage.foldername(name))[2]::uuid)
  );

create policy "storage: メンバーのみアップロード"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'post-images'
    and public.is_hiroba_member((storage.foldername(name))[2]::uuid)
    and (storage.foldername(name))[3]::uuid = auth.uid()
  );

create policy "storage: 本人のみ削除"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'post-images'
    and (storage.foldername(name))[3]::uuid = auth.uid()
  );
