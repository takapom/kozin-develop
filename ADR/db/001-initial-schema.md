# ADR-DB-001: 初期データベーススキーマ設計

- **日付:** 2025-01-29
- **ステータス:** 採用済み
- **マイグレーション:** `supabase/migrations/20250129000000_init.sql`

---

## コンテキスト

PlanLike アプリの MVP に必要なデータベーススキーマを設計する。要件定義書では `profiles`, `hirobas`, `hiroba_members`, `posts`, `plans` の5テーブルが定義されている。

---

## 決定事項

### 1. テーブル構成

要件定義の5テーブルすべてを単一の初期マイグレーションで作成した。

| テーブル | 用途 |
|---|---|
| `profiles` | ユーザー情報（`auth.users` と 1:1） |
| `hirobas` | 広場（グループ） |
| `hiroba_members` | 広場とユーザーの多対多中間テーブル |
| `posts` | 画像投稿 |
| `plans` | AI生成プラン |

### 2. 要件定義からの変更点

以下のカラム名・型を要件から変更した。

| テーブル | 要件定義 | 実装 | 変更理由 |
|---|---|---|---|
| `hirobas` | `name text` | `title text` | UI 上「タイトル」の方が自然なため |
| `posts` | `image_url text` | `image_path text` | Supabase Storage のパスを保存する設計。URL は `getPublicUrl()` で動的生成する |
| `posts` | `reactions jsonb` | `likes_count integer` | MVP では単純な「いいね」カウントで十分。JSONB はオーバースペック |
| `plans` | `description text` | `summary text` | `description` は広場でも使っており、意味の区別を明確化 |
| `plans` | `content_json jsonb` | `route_json jsonb` | ルート（経路）情報であることを明示 |
| `plans` | `is_selected boolean` | `status text ('draft' \| 'selected')` | enum の方が将来のステータス追加に対応しやすい |

### 3. 要件定義にない追加カラム

| テーブル | 追加カラム | 理由 |
|---|---|---|
| `profiles` | `created_at`, `updated_at` | 監査証跡 |
| `hirobas` | `created_at`, `updated_at` | 監査証跡 |
| `hiroba_members` | `role ('owner' \| 'member')` | オーナーとメンバーの権限分離 |
| `hiroba_members` | `status ('pending' \| 'approved' \| 'declined')` | 招待ワークフロー対応 |
| `hiroba_members` | `invited_by uuid` | 誰が招待したか追跡 |
| `posts` | `caption text` | 画像に任意のテキストを添付可能に |
| `plans` | `created_by uuid` | プラン作成者の追跡 |
| `plans` | `source_post_ids uuid[]` | どの投稿からプランが生成されたか追跡 |

### 4. トリガー・関数

| 名前 | 対象 | 動作 |
|---|---|---|
| `handle_new_user()` | `auth.users` INSERT 後 | `profiles` に自動で行を作成。`raw_user_meta_data.username` を使用し、なければ `user_XXXXXXXX` をフォールバック |
| `update_updated_at()` | `profiles`, `hirobas` の UPDATE 前 | `updated_at` を `now()` に自動更新 |

### 5. インデックス

| インデックス | 対象 | 用途 |
|---|---|---|
| `idx_hirobas_owner` | `hirobas(owner_id)` | オーナーの広場一覧取得 |
| `idx_hiroba_members_user` | `hiroba_members(user_id)` | ユーザーの所属広場一覧取得 |
| `idx_posts_hiroba` | `posts(hiroba_id, created_at DESC)` | 広場のタイムライン取得 |
| `idx_plans_hiroba` | `plans(hiroba_id)` | 広場のプラン一覧取得 |
| `idx_plans_one_selected` | `plans(hiroba_id) WHERE status='selected'` | 1広場につき selected は最大1件（UNIQUE 部分インデックス） |

### 6. RLS ポリシー

全テーブルで Row Level Security を有効化。

**ヘルパー関数:** `is_hiroba_member(p_hiroba_id)` — 認証ユーザーが当該広場の `approved` メンバーかを判定。

| テーブル | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `profiles` | 認証済みユーザー全員 | 本人のみ | 本人のみ | 本人のみ |
| `hirobas` | approved メンバーのみ | 認証済み（owner_id = 自分） | owner のみ | owner のみ |
| `hiroba_members` | 同じ広場のメンバー or 自分の行 | owner 自身の登録 or 既存メンバーの招待 | 本人 or 広場 owner | - |
| `posts` | 広場メンバーのみ | 広場メンバー（user_id = 自分） | 投稿者のみ | 投稿者のみ |
| `plans` | 広場メンバーのみ | 広場メンバー（created_by = 自分） | 作成者 or 広場 owner | - |

### 7. Storage

- **バケット:** `post-images`（非公開）
- **パス規約:** `hirobas/{hiroba_id}/{user_id}/{filename}`
- **ポリシー:** approved メンバーが閲覧・アップロード可、本人のみ削除可

---

## 未実装・今後の課題

- `seed.sql` が未作成（`config.toml` で参照されている）
- `hiroba_members` の DELETE ポリシーが未定義（退会フローの設計が必要）
- `plans` の DELETE ポリシーが未定義
- リアクション機能を拡張する場合、`likes_count` から別テーブルへの移行が必要

---

## 影響

- アプリコード（API 層・型定義）は実装カラム名（`title`, `image_path`, `route_json` 等）に合わせる必要がある
- Supabase CLI の `supabase gen types typescript` で型を自動生成し、実装との整合性を担保する
