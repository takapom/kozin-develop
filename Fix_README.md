1) AI呼び出しを“クライアント直叩き”にしない（鍵・コスト・悪用）

要件では「Dify Cloud + Gemini」を使う構成ですが、アプリ（RN）からDify/Geminiを直接呼ぶと、

APIキー漏洩（アプリ解析で抜かれる）

悪用による課金爆発

プロンプト注入／不正リクエスト
が起きやすいです。

推奨：
App → Supabase Edge Functions → (Dify/Gemini) → DB保存 → Appが取得
にして、秘密情報はEdge Functionsの環境変数で管理するのが堅いです。

2) 「グループ（広場）」はRLS設計が生命線

Supabaseを使うなら、Row Level Security（RLS）前提でテーブル設計・クエリ設計を決めるべきです。

特に以下は要件上必須：

広場メンバーだけが posts/plans を読める

広場オーナーだけが招待を作れる（or ロール制）

招待は招待されたユーザー本人だけが承認/拒否できる

注意：RLSを後付けすると実装がほぼ作り直しになります。Phase1から薄くでも入れるのが正解。

3) いまの5テーブルだと機能要件を素直に表現しにくい

要件の機能に対して、DBが足りない（or 無理が出る）部分があります。

招待（承認/拒否）：hiroba_invitations みたいなテーブルが欲しい
例：(hiroba_id, invited_user_id, invited_by, status[pending/accepted/declined], created_at)

リアクション（👍など）：post_reactions テーブルが欲しい
例：(post_id, user_id, reaction_type) に UNIQUE 制約

プランの「ルート」構造：plansがテキストだけだと、後で拡張が辛い
例：plan_items（順序、場所名、説明、予算、所要時間…）を切ると強い

MVPはplansをテキストで持ってもいいですが、Phase2〜3で確実に欲しくなるので先に方針だけ決めておくと楽です。

4) “スクショだけ”で場所を確定するのは限界がある（精度・体験）

スクショには位置情報が無いことが多く、Geminiが

店名の表記ゆれ

同名店舗の誤認

住所が出てない
などで ルート生成が不安定になりがちです。

現実的な落とし所（MVP向け）

まずは「雰囲気 + キーワード + 候補スポット」中心の“物語プラン”に寄せる

ルート（地図で案内）は Phase3以降で、Places API 等で地点確定 or ユーザー確認UIを入れる

※「AIが勝手に地図ルート作って外してる」が一番ガッカリ体験になりやすいので、最初は期待値を制御するのが重要です。

5) 共有リンクは「Webで見せる」のか「アプリで開く」のか要決着

要件に「専用ページのURLを発行しLINE共有」とありますが、技術的に2パターンあります。

ディープリンク（アプリが開く）：実装簡単。ただし受け手がアプリ未導入だと見れない

Webページ（誰でも閲覧）：要件に合うが、Webフロントが別途必要（Next.js / Expo Web など）

“誰でも見れるURL”を本気でやるなら、RLS + share_token（推測不能）+ 閲覧範囲制限の設計が必要です。

実装面のおすすめ（地味に効くやつ）
ストレージ（スクショアップロード）

private bucket + signed URL 推奨（公開バケットは事故りやすい）

アップロード前に 画像圧縮（通信量・速度・コストに直結）

ファイル名は hirobaId/userId/uuid.jpg 的に整理

認証（RN × Supabase）

セッション保存は SecureStore 等を使って安全に（Refresh tokenの扱いが雑だとログイン周りが壊れがち）

タイムライン

React QueryでOK。ただUXを上げたければ

Realtime購読（Supabase Realtime）

or 定期refetch（軽め）
のどちらかを検討

ここまでを踏まえた「技術要件の追記」テンプレ（入れると強い）

AI呼び出し経路：App → Edge Functions → Dify/Gemini（キーはサーバー側）

RLS方針：広場メンバーのみ posts/plans 読み書き可、招待/承認の権限制御

追加テーブル候補：hiroba_invitations / post_reactions / plan_items（将来拡張用）

共有リンク方式：ディープリンク or Web（どちらか明記）

画像アップロード方針：private bucket + signed URL + 圧縮