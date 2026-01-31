import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors, fonts, radii, shadows, spacing } from "../../theme/tokens";
import { GradientPillButton } from "../../components/button/GradientPillButton";
import { useAuth } from "../../contexts/AuthContext";

const logoImage = require("../../../assets/images/logo.png");

type AuthScreenProps = {
  onLogin?: () => void;
};

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const { signIn, signUp } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("入力エラー", "メールアドレスとパスワードを入力してください");
      return;
    }
    if (isSignUp && !username.trim()) {
      Alert.alert("入力エラー", "ユーザー名を入力してください");
      return;
    }

    setBusy(true);
    const result = isSignUp
      ? await signUp(email.trim(), password, username.trim())
      : await signIn(email.trim(), password);
    setBusy(false);

    if (result.error) {
      Alert.alert("エラー", result.error);
      return;
    }

    // サインアップ・ログインどちらも成功 — mailer_autoconfirm が有効なので
    // onAuthStateChange が session をセットし自動的にホームへ遷移する。
    // 旧来のコールバックも互換性のため呼ぶ。
    onLogin?.();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.logoShadow}>
            <Image source={logoImage} style={styles.logoImage} />
          </View>
          <Text style={styles.title}>
            {isSignUp ? "はじめまして！" : "おかえりなさい！"}
          </Text>
          <Text style={styles.subtitle}>
            {isSignUp
              ? "アカウントを作成しよう"
              : "アカウントにログインしよう"}
          </Text>
        </View>

        <View style={styles.form}>
          {isSignUp && (
            <>
              <Text style={styles.label}>ユーザー名</Text>
              <TextInput
                style={styles.input}
                placeholder="たかぽん"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
              />
              <View style={{ height: spacing.md }} />
            </>
          )}

          <Text style={styles.label}>メールアドレス</Text>
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={[styles.label, styles.labelSpacing]}>パスワード</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            textContentType="password"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {busy ? (
          <ActivityIndicator
            size="large"
            color={colors.accent}
            style={styles.loginButton}
          />
        ) : (
          <GradientPillButton
            label={isSignUp ? "新規登録" : "ログイン"}
            onPress={handleSubmit}
            style={styles.loginButton}
          />
        )}

        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>または</Text>
          <View style={styles.separatorLine} />
        </View>

        <Pressable style={styles.appleButton} accessibilityRole="button">
          <Text style={styles.appleText}>🍎 Appleでサインイン</Text>
        </Pressable>

        <Pressable
          style={styles.footer}
          onPress={() => setIsSignUp((prev) => !prev)}
        >
          <Text style={styles.footerText}>
            {isSignUp
              ? "すでにアカウントをお持ちの方は"
              : "アカウントをお持ちでない方は"}
          </Text>
          <Text style={styles.footerLink}>
            {isSignUp ? "ログイン" : "新規登録"}
          </Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoShadow: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    ...shadows.soft,
  },
  logoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
  },
  title: {
    fontSize: 26,
    fontFamily: fonts.heading,
    color: colors.ink,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.textSecondary,
  },
  form: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  labelSpacing: {
    marginTop: spacing.md,
  },
  input: {
    height: 52,
    borderRadius: radii.card,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    ...shadows.soft,
  },
  loginButton: {
    marginBottom: spacing.sm,
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.lg,
    gap: spacing.sm,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderSoft,
  },
  separatorText: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.textMuted,
  },
  appleButton: {
    height: 50,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.soft,
  },
  appleText: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.ink,
  },
  footer: {
    marginTop: spacing.xl,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.textMuted,
  },
  footerLink: {
    fontSize: 12,
    fontFamily: fonts.heading,
    color: colors.accent,
  },
});

