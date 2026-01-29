---
name: build
description: Expoアプリのビルド・エクスポート・デプロイを行う。「ビルドして」「本番用に書き出して」「EASでビルド」などのリクエストで使用する。
disable-model-invocation: true
allowed-tools: Read, Bash, Edit
argument-hint: [ios|android|web|preview|production]
---

# ビルド・デプロイ

Expo アプリのビルドとデプロイを実行する。

## ローカルエクスポート

```bash
# 全プラットフォーム
npx expo export

# プラットフォーム指定
npx expo export --platform web
npx expo export --platform ios
npx expo export --platform android
```

## ネイティブビルド（ローカル）

```bash
# prebuild（ネイティブプロジェクト生成）
npx expo prebuild --clean

# ビルド実行
npx expo run:ios
npx expo run:android
```

## EAS ビルド（クラウド）

```bash
# EAS CLI 確認（未インストールなら npm install -g eas-cli）
eas --version

# 設定初期化（初回のみ）
eas build:configure

# 開発ビルド
eas build --profile development --platform $ARGUMENTS

# プレビュービルド
eas build --profile preview --platform $ARGUMENTS

# 本番ビルド
eas build --profile production --platform $ARGUMENTS

# ストア提出
eas submit --platform $ARGUMENTS
```

## 手順

1. 引数からプラットフォームとプロファイルを判定する
2. EAS ビルドの場合は `eas-cli` がインストール済みか確認する
3. `eas.json` が存在しない場合は `eas build:configure` を実行する
4. ビルドを実行し、結果を報告する

## ルール

- ビルド実行前に `npx expo install --check` で依存関係を確認する
- EAS ビルドには Expo アカウントへのログインが必要（`eas login`）
- `eas.json` のプロファイル設定を確認してからビルドする
