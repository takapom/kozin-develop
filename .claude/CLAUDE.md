# kozin-develop

React Native Expo (SDK 54) + TypeScript の個人開発プロジェクト。

## 技術スタック

- Expo SDK 54 (New Architecture 有効)
- React 19.1 / React Native 0.81
- TypeScript 5.9 (strict mode)

## プロジェクト構成

- `App.tsx` — エントリーポイント（メインコンポーネント）
- `index.ts` — アプリ登録ファイル
- `app.json` — Expo 設定
- `assets/` — アイコン・スプラッシュ画像

## コマンド

- `npm start` — 開発サーバー起動
- `npm run ios` — iOS シミュレーターで起動
- `npm run android` — Android エミュレーターで起動
- `npm run web` — ブラウザで起動
- `npx expo install <pkg>` — Expo 互換バージョンでパッケージ追加
- `npx expo install --fix` — パッケージバージョン自動修正

## コーディング規約

- 言語: TypeScript（strict mode）
- コンポーネントは関数コンポーネント + React Hooks を使用する
- スタイルは `StyleSheet.create()` で定義する
- 型定義は `interface` を優先し、`type` は Union 型など必要な場合のみ使う
- ファイル名: コンポーネントは PascalCase（`MyComponent.tsx`）、それ以外は camelCase
- パッケージ追加は `npx expo install` を使い、`npm install` は直接使わない

## ディレクトリ方針

新しいファイルを追加する場合は以下の構成に従う:

```
src/
├── components/   # 再利用可能なUIコンポーネント
├── screens/      # 画面コンポーネント
├── hooks/        # カスタムフック
├── utils/        # ユーティリティ関数
├── constants/    # 定数定義
├── types/        # 型定義
└── assets/       # 画像・フォント等
```

## 注意事項

- `ios/` と `android/` は `.gitignore` 対象。`npx expo prebuild` で生成される
- `.env*.local` は Git 管理外。環境変数が必要な場合は `.env.example` を用意する
- New Architecture が有効（`newArchEnabled: true`）
