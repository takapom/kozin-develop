# ADR: URL投稿機能 & 広場詳細画面リデザイン

## 実装内容

### 1. 広場詳細画面（HirobaScreen）のリデザイン
- パララックスヒーローヘッダーを廃止し、コンパクトなメタ情報バー（アバター群 + 参加人数 + 投稿枚数）に変更
- 投稿一覧を2列均等グリッドからPinterest風Masonryレイアウト（高さ可変2列）に変更
- 投稿カードを画像主役のデザインに再設計（フローティングいいねボタン付き）
- ボトムアクションの優先度を逆転（「投稿する」= 主アクション、「プランを作る」= 副アクション）
- 広場テーマカラーをHomeScreenからHirobaScreenへ引き継ぐよう改善

### 2. URL投稿機能
- ユーザーがURLを入力すると、ページ内の画像候補を3〜5枚抽出し、選択して投稿できる機能
- Supabase Edge Function 2つ:
  - `extract-images`: URLのHTMLをフェッチし、OGP/twitter:image/img要素から画像候補を抽出
  - `create-post`: 選択された画像をDL → Supabase Storageにアップロード → postsテーブルにINSERT
- クライアント側:
  - 3ステップモーダル（URL入力 → 画像候補選択 → 投稿）
  - TanStack Query useMutationによるキャッシュ自動更新

### 3. 変更ファイル一覧

#### サーバーサイド
- `supabase/functions/extract-images/index.ts` - 画像候補抽出Edge Function
- `supabase/functions/create-post/index.ts` - 投稿作成Edge Function
- `supabase/functions/deno.json` - Deno型定義設定

#### クライアントサイド
- `src/screens/HirobaScreen.tsx` - Masonryレイアウト化 + モーダル接続
- `src/screens/HomeScreen.tsx` - テーマカラー引き継ぎ
- `src/App.tsx` - themeIndex props追加
- `src/api/posts.ts` - extractImages(), createPost() 追加
- `src/hooks/useCreatePost.ts` - useMutation hooks
- `src/components/feature/PostModal.tsx` - 投稿モーダル
- `src/components/ui/GlassCard.tsx` - StyleProp型修正
- `src/constants/hirobaTheme.ts` - テーマ定数集約

---

## 実装方針

### 画像抽出をサーバーサイド（Edge Function）で行う理由
- クライアント（React Native）からのHTMLフェッチは一部サイトがモバイルUAをブロックする
- 画像DL → Storageアップロードをクライアントで行うとメモリ・通信量の負担が大きい
- クライアントにはDOM parserがないため、HTMLの解析精度が落ちる
- Edge Function内で完結すればStorageへのアクセスもService Role Keyで直接操作可能

### 画像抽出ロジックの優先順位
1. `og:image` メタタグ
2. `twitter:image` メタタグ
3. `<img>` 要素（src, data-src, data-lazy-src）からサイズフィルタリングして最大5枚

### 認証フロー
- Supabaseゲートウェイは `Authorization` ヘッダーのJWTを検証するため、anon keyを `Authorization` に設定
- ユーザーのaccess_tokenはカスタムヘッダー `x-user-token` で送信
- Edge Function内で `supabase.auth.getUser(jwt)` によりユーザーを検証

### Storageパス規則
- `post-images/hirobas/{hiroba_id}/{user_id}/{timestamp}.{ext}`
- 既存の `fetchHirobaPosts` の `createSignedUrl` と整合

---

## 遭遇したError

### 1. VSCode上の `Deno` 型エラー
- **症状**: `名前 'Deno' が見つかりません (ts 2304)` / `モジュール 'https://deno.land/x/deno_dom@...' が見つかりません (ts 2307)`
- **原因**: VSCodeはNode.js用TypeScriptチェッカーで動作しており、DenoランタイムのAPIやURLインポートを認識できない

### 2. Edge Function `non-2xx status code`
- **症状**: クライアントから `extract-images` を呼ぶと `Error: Edge Function returned a non-2xx status code`
- **原因**: Edge Functionが未デプロイだった（ファイルは作成したがsupabase functions deployを実行していなかった）

### 3. サイトからの403/404ブロック
- **症状**: 食べログやホットペッパーのURLを入力すると `Failed to fetch URL: 403 Forbidden` / `404 Not Found`
- **原因**: Edge Function（Deno Deploy）のIPがクラウドサービスの帯域であり、Bot対策の厳しいサイトがアクセスをブロックしている。User-Agentを偽装してもIP帯域で判定されるため回避不可

### 4. `create-post` の 401 Unauthorized
- **症状**: 投稿保存時に `HTTP 401` / `Invalid JWT`
- **原因**: Supabaseゲートウェイが `Authorization` ヘッダーのJWTをanon key署名として検証するが、ユーザーのaccess_tokenを `Authorization` に入れていたためゲートウェイに拒否された

### 5. Instagramの画像抽出不可
- **症状**: InstagramのURLからは画像を取得できない
- **原因**: 未ログイン状態でのアクセスはログイン画面にリダイレクトされる。Edge Functionにはセッション/Cookieがないため、共有リンクであってもブロックされる。規約上スクレイピングも禁止

---

## 突破方法

### 1. VSCode Deno型エラー → 正規表現ベースに書き換え + @ts-ignore
- `deno-dom` ライブラリへの依存を完全に削除し、正規表現ベースのHTML解析に書き換え
- `Deno.serve` には `// @ts-ignore` を追加してNode用チェッカーを抑制
- `supabase/functions/deno.json` に `"lib": ["deno.ns", "deno.unstable"]` を設定

### 2. Edge Function未デプロイ → `supabase functions deploy` 実行
- `supabase functions deploy extract-images` と `supabase functions deploy create-post` を実行してデプロイ

### 3. サイトからのブロック → エラーメッセージの改善
- クラウドIPからのアクセスブロックは技術的に回避不可能
- クライアント側で403/404等のステータスに応じた日本語エラーメッセージを表示（「このサイトには対応していません」「アクセスが制限されています」等）
- MVP段階ではBot制限のないサイト（note.com等）で動作確認し、将来的にスクショ画像アップロードとの併用で対応範囲を拡大する方針

### 4. 401認証エラー → カスタムヘッダー方式に変更
- `Authorization` ヘッダーにはanon keyを設定（ゲートウェイ通過用）
- ユーザーのaccess_tokenはカスタムヘッダー `x-user-token` で送信
- Edge Function側はCORSで `x-user-token` を許可し、そこからJWTを読み取って `getUser()` で検証
- `supabase.functions.invoke()` の使用をやめ、直接 `fetch()` に変更して完全にヘッダーを制御

### 5. Instagram → 対応不可、代替手段で対応
- ログインウォールの突破は規約違反のため行わない
- 将来的にスクショ画像アップロード機能（元の要件定義にあった）をURL入力と並行して選択可能にし、URLで取れないサイトはスクショで投稿する運用とする
