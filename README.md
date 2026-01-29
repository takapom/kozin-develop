# kozin-develop

React Native Expo (SDK 54) + TypeScript プロジェクト

## 技術スタック

| パッケージ | バージョン |
|---|---|
| Expo SDK | 54 |
| React | 19.1.0 |
| React Native | 0.81.5 |
| TypeScript | 5.9.x |

## セットアップ

```bash
# 依存パッケージのインストール
npm install
```

## 開発サーバー

```bash
# 開発サーバー起動（Expo DevTools）
npx expo start

# キャッシュクリアして起動
npx expo start -c

# プラットフォーム指定で起動
npx expo start --ios       # iOSシミュレーター
npx expo start --android   # Androidエミュレーター
npx expo start --web       # ブラウザ

# Expo Go で起動
npx expo start --go

# カスタムDev Client で起動
npx expo start --dev-client

# ホスト設定
npx expo start --tunnel     # ngrokトンネル経由（外部ネットワーク接続）
npx expo start --lan        # ローカルネットワーク（デフォルト）
npx expo start --localhost   # localhost接続

# ポート指定
npx expo start --port 3000
```

## npm scripts

```bash
npm start        # npx expo start
npm run ios      # npx expo start --ios
npm run android  # npx expo start --android
npm run web      # npx expo start --web
```

## パッケージ管理

```bash
# Expo互換バージョンでパッケージをインストール
npx expo install <パッケージ名>

# 例
npx expo install expo-camera expo-location

# devDependencies としてインストール
npx expo install <パッケージ名> --dev

# インストール済みパッケージの互換性チェック
npx expo install --check

# 互換性のないバージョンを自動修正
npx expo install --fix
```

## ネイティブビルド

```bash
# ネイティブプロジェクトファイルの生成（prebuild）
npx expo prebuild

# プラットフォーム指定
npx expo prebuild --platform ios
npx expo prebuild --platform android

# ネイティブフォルダをクリーンしてから再生成
npx expo prebuild --clean

# iOSネイティブビルド実行
npx expo run:ios

# Androidネイティブビルド実行
npx expo run:android
```

## エクスポート（本番ビルド）

```bash
# 静的ファイルをエクスポート（dist/ に出力）
npx expo export

# プラットフォーム指定
npx expo export --platform web
npx expo export --platform ios
npx expo export --platform android

# 出力先ディレクトリ指定
npx expo export --output-dir build

# ソースマップ付きでエクスポート
npx expo export --source-maps

# キャッシュクリアしてエクスポート
npx expo export --clear
```

## EAS (Expo Application Services)

```bash
# EAS CLIのインストール
npm install -g eas-cli

# Expoアカウントにログイン
eas login

# EASビルド設定の初期化
eas build:configure

# 開発ビルド
eas build --profile development --platform ios
eas build --profile development --platform android

# プレビュービルド
eas build --profile preview --platform all

# 本番ビルド
eas build --profile production --platform ios
eas build --profile production --platform android

# App Store / Google Play へ提出
eas submit --platform ios
eas submit --platform android

# OTAアップデート配信
eas update --branch production --message "バグ修正"
```

## Expoアカウント管理

```bash
npx expo login       # ログイン
npx expo logout      # ログアウト
npx expo whoami      # ログイン中のユーザー確認
npx expo register    # アカウント新規登録
```

## 設定確認

```bash
# Expoプロジェクト設定を表示
npx expo config

# テンプレートファイルのカスタマイズ
npx expo customize
```

## よく使うライブラリのインストール例

```bash
# ナビゲーション
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context

# 画像ピッカー
npx expo install expo-image-picker

# カメラ
npx expo install expo-camera

# 位置情報
npx expo install expo-location

# ローカルストレージ
npx expo install @react-native-async-storage/async-storage

# フォント
npx expo install expo-font

# アイコン
npx expo install @expo/vector-icons

# 線形グラデーション
npx expo install expo-linear-gradient

# Haptics（触覚フィードバック）
npx expo install expo-haptics

# Notifications（通知）
npx expo install expo-notifications

# Splash Screen
npx expo install expo-splash-screen
```

## トラブルシューティング

```bash
# Metro Bundler のキャッシュクリア
npx expo start -c

# node_modules 再インストール
rm -rf node_modules && npm install

# iOS の Pod 再インストール（prebuild 後）
cd ios && pod install --repo-update && cd ..

# Watchman のキャッシュクリア
watchman watch-del-all

# Expo の設定診断
npx expo-doctor
```
