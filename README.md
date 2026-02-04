# 最終要件定義書 ver.Final

## 1. アプリ概要

| 項目 | 内容 |
|---|---|
| アプリ名（案） | PlanLike / GoLike / LikeTrip |
| コンセプト | 「みんなの『好き』を、AIがひとつの物語（プラン）にする。」 |
| ターゲットユーザー | 高校生、大学生、20代。タイムパフォーマンスを重視しつつ、「自分たちらしさ」を求める層 |

**コア体験:**
友人や恋人と「ここ良くない？」と感じた瞬間のスクリーンショットを、グループ専用の「広場」に投げ合う。AIがそれらの画像から「みんなの今の気分」を読み取り、特別な名前のついた複数のルートプランを提案する。

---

## 2. 機能要件

### 2.1. ユーザー認証・グループ基盤

- **認証:** Supabase Auth を利用したメールアドレス/パスワードによるアカウント作成・ログイン機能
- **プロフィール:** ユーザー名とアバター画像を設定できる
- **広場（グループ）機能:**
  - ユーザーは目的別（例：「今週末の渋谷」「卒業旅行」）に複数の「広場」を作成・管理できる
  - 広場の作成者は、他のユーザーをアカウント名で検索して招待できる
  - 招待された側は承認・拒否を選択でき、承認するとメンバーになる

### 2.2. 「LIKE」投稿機能

- **入力方法:** スマートフォンのフォトライブラリからスクリーンショット画像をアップロードする
  - **理由:** URLをコピー＆ペーストする手間を省き、ユーザーの日常的な行動（スクショ）をそのままアプリ体験に繋げるため
- **表示:** 投稿された画像は「広場」のタイムラインに一覧表示され、誰がどの画像を投稿したかが直感的にわかる
- **リアクション:** 各画像に対して、簡単なリアクション（例: 👍）を付けられる

### 2.3. AIプランニング機能

- **画像解析:** AI (Gemini Vision) がアップロードされた複数の画像から、テキスト情報、ランドマーク、場所の雰囲気（例: エモい、賑やか、静か）を抽出する
- **プラン生成:** 抽出した情報と、ユーザーが任意で入力する追加要望（予算、時間、食べたいもの等）を統合し、コンセプトの異なる3つのルートプランを生成する
- **プラン・ネーミング:** AIが各プランにキャッチーな名前を付与する
  - 例: 「100%映える。最先端トレンド追求コース」「予算3000円！節約しつつ満足チルコース」

### 2.4. 共有・決定機能

- **プラン選択:** AIが提案した3つのプランの中から、グループで話し合い、実行するプランを1つ選択する
- **共有リンク:** 決定したプランの詳細を確認できる専用ページのURLを発行し、LINE等の外部アプリで共有可能にする

---

## 3. 技術要件

### 3.1. 全体アーキテクチャ

| レイヤー | 技術 |
|---|---|
| フロントエンド | React Native (Expo) |
| バックエンド | Supabase (Database, Auth, Storage) |
| AIオーケストレーション | Dify Cloud |
| LLM | Google Gemini (1.5 Pro / Flash) - Vision機能活用 |

3.1. 全体アーキテクチャ
（ご提示いただいた内容と同様）
3.2. データベース (Supabase/PostgreSQL)
基本設計: profiles, hirobas, hiroba_members（中間テーブル）, posts, plans の5つのテーブルで構成し、ユーザーと広場の「多対多」の関係を中間テーブルで適切に管理する。
型定義: Supabase CLI を用いてDBスキーマからTypeScriptの型を自動生成し、これを「信頼できる唯一の情報源」としてアプリ全体で利用する。
テーブル定義詳細:

・profiles テーブル (ユーザー情報)
| カラム名         | データ型   | 説明         | 制約 / 備考                        |
| :----------- | :----- | :--------- | :----------------------------- |
| `id`         | `uuid` | ユーザーID     | **主キー**, `auth.users.id`への外部キー |
| `username`   | `text` | ユーザー名      | **必須**, `UNIQUE`               |
| `avatar_url` | `text` | アバター画像のURL | `NULL`許可                       |

・hirobas テーブル (広場)
| カラム名          | データ型   | 説明       | 制約 / 備考             |
| :------------ | :----- | :------- | :------------------ |
| `id`          | `uuid` | 広場ID     | **主キー**             |
| `owner_id`    | `uuid` | 広場の作成者ID | `profiles.id`への外部キー |
| `name`        | `text` | 広場の名前    | **必須**              |
| `description` | `text` | 広場の説明    | `NULL`許可            |

・hiroba_members テーブル (広場参加メンバー)
| カラム名        | データ型          | 説明     | 制約 / 備考                        |
| :---------- | :------------ | :----- | :----------------------------- |
| `hiroba_id` | `uuid`        | 広場ID   | **複合主キー**, `hirobas.id`への外部キー  |
| `user_id`   | `uuid`        | ユーザーID | **複合主キー**, `profiles.id`への外部キー |
| `joined_at` | `timestamptz` | 参加日時   | デフォルト `now()`                  |

・posts テーブル (投稿)
| カラム名        | データ型    | 説明         | 制約 / 備考                     |
| :---------- | :------ | :--------- | :-------------------------- |
| `id`        | `uuid`  | 投稿ID       | **主キー**                     |
| `hiroba_id` | `uuid`  | 投稿先の広場ID   | **必須**, `hirobas.id`への外部キー  |
| `user_id`   | `uuid`  | 投稿者のユーザーID | **必須**, `profiles.id`への外部キー |
| `image_url` | `text`  | 画像のURL     | **必須**                      |
| `reactions` | `jsonb` | リアクション情報   | `NULL`許可                    |

・plans テーブル (AI生成プラン)
| カラム名           | データ型      | 説明          | 制約 / 備考                    |
| :------------- | :-------- | :---------- | :------------------------- |
| `id`           | `uuid`    | プランID       | **主キー**                    |
| `hiroba_id`    | `uuid`    | 属する広場ID     | **必須**, `hirobas.id`への外部キー |
| `name`         | `text`    | AIが命名したプラン名 | **必須**                     |
| `description`  | `text`    | プランの概要説明    | `NULL`許可                   |
| `content_json` | `jsonb`   | プラン詳細       | **必須**                     |
| `is_selected`  | `boolean` | 決定プランか否か    | デフォルト `false`              |



### 3.3. フロントエンドアーキテクチャ (React Native)

**状態管理:**

| 種別 | 管理方法 | 備考 |
|---|---|---|
| サーバー状態 | TanStack Query (React Query) | APIからのデータ取得、キャッシュ、重複リクエスト防止を自動化。`useState` + `useEffect` による手動データ取得は原則禁止 |
| クライアント状態 | `useState` | フォーム入力値やモーダルの開閉など、UI起因の状態管理 |
| グローバル状態 | React Context | 認証情報など、アプリ全体で共有するクライアント状態 |

**ディレクトリ構成:**
`src` ディレクトリ配下に `api`, `components`, `hooks`, `screens`, `types` などを機能的に配置し、コードの可読性と保守性を高める。

**ディレクトリ構造：**

app/
├── src/
│   ├── api/               # 外部API(Supabase, Dify)との通信ロジック
│   ├── assets/            # 画像、フォントなどの静的ファイル
│   ├── components/
│   │   ├── ui/            # 汎用的なUI部品 (Button, Input, Cardなど)
│   │   └── feature/       # 特定機能に特化した複合コンポーネント (HirobaList, PlanCardなど)
│   ├── constants/         # 定数 (色コード、APIエンドポイントなど)
│   ├── contexts/          # React Context (認証状態など)
│   ├── features/          # 各機能のコアロジック (認証、広場管理など)
│   ├── hooks/             # カスタムフック (useAuth, useHirobaなど)
│   ├── navigation/        # 画面遷移の定義 (React Navigation / Expo Router)
│   ├── screens/           # 各画面のトップレベルコンポーネント
│   ├── types/             # アプリ全体で使う型定義 (TypeScript)
│   └── utils/             # 汎用的なヘルパー関数
│
└── app.json               # Expo設定ファイル


---

## 4. 環境構築

### 4.1. 前提条件

- Node.js 18以上
- npm または yarn
- Expo CLI (`npm install -g expo-cli`)
- Supabase CLI (`brew install supabase/tap/supabase`)

### 4.2. インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd kozin-develop

# 依存パッケージをインストール
npm install
```

### 4.3. 環境変数の設定

#### クライアント側（Expo / React Native）

`.env` ファイルをプロジェクトルートに作成：

```bash
cp .env.example .env
```

`.env` の内容：
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### サーバー側（Supabase Edge Functions）

Edge Functionsで使用する環境変数は **Supabase Secrets** に設定が必要です。
ローカルの `.env` ファイルはEdge Functionsには適用されません。

```bash
# Supabaseにログイン
supabase login

# プロジェクトをリンク
supabase link --project-ref <your-project-ref>

# Secretsを設定
supabase secrets set HOTPEPPER_API_KEY=your-api-key

# 設定済みのSecretsを確認
supabase secrets list
```

| 環境変数 | 用途 | 設定先 |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | SupabaseのURL | `.env` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabaseの匿名キー | `.env` |
| `HOTPEPPER_API_KEY` | Hotpepper API | `supabase secrets` |

### 4.4. Edge Functionsのデプロイ

```bash
# extract-images関数をデプロイ
supabase functions deploy extract-images --no-verify-jwt

# create-post関数をデプロイ
supabase functions deploy create-post --no-verify-jwt
```

### 4.5. アプリの起動

```bash
# 開発サーバーを起動
npx expo start

# iOSシミュレータで起動
npx expo start --ios

# Androidエミュレータで起動
npx expo start --android

# Webブラウザで起動
npx expo start --web
```

---

## 5. 開発ロードマップ（優先順位）

### Phase 1 (MVP)

- ユーザー認証機能
- 単一の広場内で、画像を1枚アップロードできる
- アップロードされた1枚の画像情報を含む、「名前付きプラン」が1つ生成・表示される

> **目標:** アプリの最もコアな価値である「画像からプランが生成される」体験を最速で実現する

### Phase 2

- 複数ユーザーが参加できるグループ（広場）機能の実装
- 複数の画像から情報を統合してプランを生成するロジックの実装

### Phase 3

- AIが3案のプランを提示する機能
- プラン選択・共有機能の実装
- UI/UXの全体的なブラッシュアップ

## 6. デザイン案
### html参照(URLに入力で参照可能)：
file:///Users/takagiyuuki/Downloads/Planlike%20Figma%20Export.html

### Figma版：
https://www.figma.com/slides/m1NFGMcThimWgr0tVl2eMo/html.to.design-%E2%80%94-by-%E2%80%B9div%E2%80%BARIOTS-%E2%80%94-Import-websites-to-Figma-designs--web-html-css---Community-?node-id=1-593&t=IMIRj5oMZzNvUPcp-1
