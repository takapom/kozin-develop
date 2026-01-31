# ADR-DB-002: ダミーデータ → Supabase 実データ接続

- **日付:** 2025-01-31
- **ステータス:** 採用済み
- **関連:** ADR-DB-001（初期スキーマ設計）

---

## コンテキスト

HomeScreen, HirobaScreen, HirobaSettingsScreen の3画面がハードコードされたダミーデータで動作していた。要件定義書に従い TanStack Query を導入し、Supabase からの実データ取得に切り替える必要があった。

---

## 決定事項

### 1. アーキテクチャ: api/ と hooks/ の分離

```
api/    → 純粋な async 関数（Supabase 呼び出し。React に依存しない）
hooks/  → useQuery + api/ を組み合わせた React Hook（キャッシュ・ローディング管理）
```

**理由:** `api/` を React 非依存にすることで、テストやサーバーサイドからも呼び出し可能にする。`useQuery` は React Hook のため `hooks/` に配置。要件定義書のディレクトリ構成にも合致。

### 2. TanStack Query の設定

| 設定 | 値 | 理由 |
|---|---|---|
| `staleTime` | 5分 | 画面遷移のたびに再フェッチしない。広場データの更新頻度を考慮 |
| `retry` | 2回 | ネットワーク一時障害への対応 |

`QueryClientProvider` は `AuthProvider` の外側に配置（認証状態に関わらずキャッシュを保持）。

### 3. API 関数とクエリ設計

| 関数 | クエリ | 用途 |
|---|---|---|
| `fetchMyHirobas()` | `hirobas.select('*, hiroba_members!...!inner(count), posts(count)')` | HomeScreen の広場カード表示（集計値のみ） |
| `fetchHiroba(id)` | `hirobas.select('*').eq('id', id).single()` | 広場詳細・設定画面のタイトル等 |
| `fetchHirobaPosts(id)` | `posts.select('*, profiles:user_id(...)').eq('hiroba_id', id)` | 広場の投稿一覧 + 投稿者プロフィール |
| `fetchHirobaMembers(id)` | `hiroba_members.select('*, profiles!...user_id_fkey(...)').eq('status', 'approved')` | メンバー一覧 + プロフィール |

### 4. FK ヒントによる曖昧性解消

`hiroba_members` は `profiles` への外部キーが2つ存在する（`user_id`, `invited_by`）。Supabase (PostgREST) はどちらの FK を使うか判別できないため、明示的なヒントが必要。

```
profiles!hiroba_members_user_id_fkey(id, username, avatar_url)
```

### 5. メンバー数の取得: 集計 vs 実データ

| 画面 | 取得方法 | 理由 |
|---|---|---|
| HomeScreen（広場カード） | `hiroba_members(count)` → `{ count: 3 }` | 数値だけ必要。軽量 |
| HirobaScreen / Settings | `fetchHirobaMembers()` → 実データ配列 | アバター・名前・ロール表示が必要。`members.length` でカウント算出 |

重複ではなく、画面ごとのデータ粒度に応じた設計。

### 6. 画像 URL の生成

投稿画像は Storage の非公開バケット `post-images` に保存されているため、`createSignedUrl()` で1時間有効の署名付き URL を生成。

### 7. 型定義

Supabase の自動型推論が複雑な JOIN で正しく動作しないケースがあるため、明示的な型を定義。

| 型名 | 定義 |
|---|---|
| `HirobaWithCounts` | `Hiroba & { hiroba_members: { count }[], posts: { count }[] }` |
| `PostWithProfile` | `Post & { profiles: Pick<Profile, ...>, imageUrl: string \| null }` |
| `MemberWithProfile` | `HirobaMember & { profiles: Pick<Profile, ...> }` |

### 8. Router の修正

`selectedHirobaId` state を追加し、`onSelectHiroba` で ID を受け取り、`HirobaScreen` / `HirobaSettingsScreen` に `hirobaId` props として渡すよう修正。

---

## ファイル一覧

| 操作 | ファイル |
|---|---|
| 新規 | `src/lib/queryClient.ts` |
| 新規 | `src/api/hirobas.ts`, `posts.ts`, `members.ts` |
| 新規 | `src/hooks/useMyHirobas.ts`, `useHiroba.ts`, `useHirobaPosts.ts`, `useHirobaMembers.ts` |
| 新規 | `src/utils/relativeTime.ts` |
| 修正 | `src/App.tsx` |
| 修正 | `src/screens/HomeScreen.tsx`, `HirobaScreen.tsx`, `HirobaSettingsScreen.tsx` |

---

## 未実装・今後の課題

- 広場作成（INSERT）のミューテーション未実装
- 投稿アップロード（Storage + INSERT）のミューテーション未実装
- `invalidateQueries` によるキャッシュ無効化（作成・更新後の再フェッチ）
- エラー時のリトライ UI / トースト通知
- Pull-to-refresh による手動再フェッチ
- `relativeTime()` のリアルタイム更新（現在は画面表示時の固定値）
