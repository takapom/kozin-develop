import React, { useState, useRef } from "react";
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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radii, spacing } from "../../theme/tokens";
import { glass } from "../../theme/glass";
import { GlassCard } from "../../components/ui/GlassCard";
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

  // フォーカス管理用 ref
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

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

    onLogin?.();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={8}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            {/* ── ヘッダー ── */}
            <View style={styles.header}>
              <View style={styles.logoWrap}>
                <Image
                  source={logoImage}
                  style={styles.logoImage}
                  accessibilityLabel="PlanLikeロゴ"
                />
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

            {/* ── メインカード (Liquid Glass) ── */}
            <GlassCard style={styles.mainCard}>
              {/* フォーム */}
              {isSignUp && (
                <>
                  <Text style={styles.label}>ユーザー名</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="たかぽん"
                    placeholderTextColor="rgba(27, 27, 29, 0.35)"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current?.focus()}
                    value={username}
                    onChangeText={setUsername}
                    accessibilityLabel="ユーザー名"
                  />
                  <View style={{ height: spacing.md }} />
                </>
              )}

              <Text style={styles.label}>メールアドレス</Text>
              <TextInput
                ref={emailRef}
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="rgba(27, 27, 29, 0.35)"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                value={email}
                onChangeText={setEmail}
                accessibilityLabel="メールアドレス"
              />

              <Text style={[styles.label, styles.labelSpacing]}>パスワード</Text>
              <TextInput
                ref={passwordRef}
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="rgba(27, 27, 29, 0.35)"
                secureTextEntry
                textContentType="password"
                autoComplete="password"
                returnKeyType="done"
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                  if (!busy) handleSubmit();
                }}
                value={password}
                onChangeText={setPassword}
                accessibilityLabel="パスワード"
              />

              {/* メインボタン */}
              <View style={styles.submitWrap}>
                {busy ? (
                  <View style={styles.busyButton}>
                    <ActivityIndicator size="small" color={colors.white} />
                  </View>
                ) : (
                  <GradientPillButton
                    label={isSignUp ? "新規登録" : "ログイン"}
                    onPress={handleSubmit}
                    height={56}
                  />
                )}
              </View>

              {/* セパレータ */}
              <View style={styles.separator}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>または</Text>
                <View style={styles.separatorLine} />
              </View>

              {/* Apple サインイン */}
              <Pressable
                style={({ pressed }) => [
                  styles.appleButton,
                  pressed && styles.applePressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Appleでサインイン"
              >
                <Ionicons name="logo-apple" size={22} color={colors.ink} />
                <Text style={styles.appleText}>Appleでサインイン</Text>
              </Pressable>
            </GlassCard>

            {/* ── フッター ── */}
            <Pressable
              style={styles.footer}
              onPress={() => setIsSignUp((prev) => !prev)}
              accessibilityRole="button"
              accessibilityLabel={
                isSignUp ? "ログイン画面に切り替え" : "新規登録画面に切り替え"
              }
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
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// ─── スタイル ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: spacing.xxl,
  },

  // ── ヘッダー ──
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoWrap: {
    width: 76,
    height: 76,
    borderRadius: 22,
    marginBottom: 24,
    shadowColor: colors.accent,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  logoImage: {
    width: 76,
    height: 76,
    borderRadius: 22,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.heading,
    color: colors.ink,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    fontFamily: fonts.body,
    color: "rgba(27, 27, 29, 0.6)",
    textAlign: "center",
    lineHeight: 21,
  },

  // ── メインカード ──
  mainCard: {
    padding: 24,
    borderRadius: 28,
  },

  // ── フォーム ──
  label: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.textMuted,
    marginBottom: 6,
    marginLeft: 4,
  },
  labelSpacing: {
    marginTop: spacing.md,
  },
  input: {
    height: 50,
    borderRadius: glass.borderRadius.md,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    paddingHorizontal: spacing.md,
    fontSize: 16,
    fontFamily: fonts.body,
    color: colors.ink,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.12)",
  },

  // ── 送信ボタン ──
  submitWrap: {
    marginTop: 24,
  },
  busyButton: {
    height: 56,
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── セパレータ ──
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 8,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(27, 27, 29, 0.1)",
  },
  separatorText: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: "rgba(27, 27, 29, 0.4)",
  },

  // ── Apple ボタン ──
  appleButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  applePressed: {
    opacity: 0.7,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  appleText: {
    fontSize: 16,
    fontFamily: fonts.body,
    color: colors.ink,
  },

  // ── フッター ──
  footer: {
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 15,
    fontFamily: fonts.body,
    color: "rgba(27, 27, 29, 0.6)",
  },
  footerLink: {
    fontSize: 15,
    fontFamily: fonts.heading,
    color: colors.accent,
  },
});
