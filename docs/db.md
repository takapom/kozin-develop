# Supabase 連携・DB設計 方針

本ドキュメントは、要件定義に基づく Supabase の DB 設計と実装方針をまとめたもの。

## 1. 全体方針

- DB は 5 テーブル（profiles / hirobas / hiroba_members / posts / plans）で構成
- 画像は Storage に保存し、DB には相対パスのみ保持
- RLS を必須とし、原則「広場メンバーのみ参照可能」
- TypeScript 型は Supabase CLI で自動生成し、アプリの単一の真実とする
- いいねはカウントのみ（履歴テーブルは作らない）

## 2. テーブル定義（最小構成）

### profiles
- id uuid PK（auth.users.id と連動）
- username text unique
- avatar_url text null
- created_at / updated_at

### hirobas
- id uuid PK
- owner_id uuid（profiles.id）
- title text
- description text null
- created_at / updated_at

### hiroba_members（多対多）
- hiroba_id uuid
- user_id uuid
- role text（owner / member）
- status text（pending / approved / declined）
- invited_by uuid
- created_at
- PK: (hiroba_id, user_id)

### posts
- id uuid PK
- hiroba_id uuid
- user_id uuid
- image_path text（Storage 相対パス）
- caption text null
- likes_count int default 0
- created_at

### plans
- id uuid PK
- hiroba_id uuid
- created_by uuid
- name text
- summary text null
- route_json jsonb
- source_post_ids uuid[]
- status text（draft / selected）
- created_at

備考:
- `plans.status = 'selected'` を 1 つの広場に 1 件だけ許可する部分ユニーク制約を付ける

## 3. RLS ポリシー方針

### profiles
- SELECT: 認証済みユーザーは全件閲覧可
- INSERT/UPDATE/DELETE: 本人のみ

### hirobas
- SELECT: approved メンバーのみ
- INSERT/UPDATE/DELETE: owner のみ

### hiroba_members
- SELECT: 同じ広場メンバー or 自分の行
- INSERT: owner（または既存メンバー）による招待
- UPDATE: 
  - 自分の行は status の更新可（承認/拒否）
  - owner は role/status 更新可

### posts
- SELECT/INSERT: 広場メンバーのみ
- UPDATE/DELETE: 投稿者のみ

### plans
- SELECT/INSERT: 広場メンバーのみ
- UPDATE: created_by または owner（どちらにするかは実装時に決定）

## 4. Storage 方針

- バケット名: `post-images`
- パス規約: `hirobas/{hiroba_id}/{user_id}/{uuid}.jpg`
- Storage ポリシー:
  - name から hiroba_id を抽出し、hiroba_members の approved のみ read/write

## 5. 実装手順（DB 側）

1. Supabase CLI でプロジェクト初期化（または既存プロジェクトに接続）
2. `supabase/migrations/<timestamp>_init.sql` にテーブル/制約/インデックス/トリガーを定義
3. RLS を ON にしてポリシーを追加
4. `profiles` 自動生成トリガー（auth.users INSERT 連動）を追加
5. 型生成: `supabase gen types typescript > src/types/supabase.ts`

## 6. 実装手順（アプリ側）

- `src/lib/supabase.ts` に `createClient<Database>()` を定義
- 環境変数:
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## 7. 未決事項（実装時に判断）

- plans の UPDATE 権限（created_by のみか、owner にも許可するか）
- profiles の公開範囲を将来的に「同じ広場メンバーのみ」に絞るか

