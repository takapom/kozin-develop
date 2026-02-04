import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Switch,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fonts, radii, spacing } from '../theme/tokens';
import { glass } from '../theme/glass';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassNavBar } from '../components/ui/GlassNavBar';
import { useHiroba } from '../hooks/useHiroba';
import { useHirobaMembers } from '../hooks/useHirobaMembers';
import { useDeleteHiroba } from '../hooks/useDeleteHiroba';
import { useAuth } from '../contexts/AuthContext';

const MEMBER_COLORS = ['#FBD6E3', '#FFE8B5', '#DDE8FF', '#B7E8D0', '#FFD6C2'];
const STAGGER_MS = glass.animation.staggerDelay;

// ─── AnimatedSection ───────────────────────────────────────
// 各セクションをスタガー付きフェードイン + スライドで表示する
function AnimatedSection({ index, children }: { index: number; children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    const delay = index * STAGGER_MS;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        damping: glass.animation.spring.damping,
        stiffness: glass.animation.spring.stiffness,
        mass: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.section, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

// ─── PressableScale ───────────────────────────────────────
// タップ時にスケールアニメーション + ハプティクスを付与
function PressableScale({
  onPress,
  children,
  style,
  hapticStyle = Haptics.ImpactFeedbackStyle.Light,
  accessibilityLabel,
}: {
  onPress: () => void;
  children: React.ReactNode;
  style?: object;
  hapticStyle?: Haptics.ImpactFeedbackStyle;
  accessibilityLabel?: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => {
          Haptics.impactAsync(hapticStyle);
          onPress();
        }}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        hitSlop={6}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

// ─── メイン画面 ──────────────────────────────────────────────
type HirobaSettingsScreenProps = {
  hirobaId?: string;
  onBack?: () => void;
  onDeleted?: () => void;
};

export function HirobaSettingsScreen({ hirobaId, onBack, onDeleted }: HirobaSettingsScreenProps) {
  const { signOut } = useAuth();
  const { data: hiroba, isLoading: hirobaLoading } = useHiroba(hirobaId ?? '');
  const { data: members, isLoading: membersLoading } = useHirobaMembers(hirobaId ?? '');
  const deleteMutation = useDeleteHiroba();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notifyPost, setNotifyPost] = useState(true);
  const [notifyPlan, setNotifyPlan] = useState(false);

  useEffect(() => {
    if (hiroba) {
      setTitle(hiroba.title);
      setDescription(hiroba.description ?? '');
    }
  }, [hiroba]);

  const handleSwitchToggle = useCallback(
    (setter: React.Dispatch<React.SetStateAction<boolean>>) => (value: boolean) => {
      Haptics.selectionAsync();
      setter(value);
    },
    [],
  );

  const handleDelete = useCallback(() => {
    if (!hirobaId) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert('広場を削除', 'この操作は取り消せません。本当に削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除する',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(hirobaId);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onDeleted?.();
          } catch (err) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('エラー', '削除に失敗しました。もう一度お試しください。');
          }
        },
      },
    ]);
  }, [hirobaId, deleteMutation, onDeleted]);

  const handleLogout = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert('ログアウト', 'ログアウトしますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: 'ログアウト',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  }, [signOut]);

  const isHirobaMode = !!hirobaId;

  if (isHirobaMode && (hirobaLoading || membersLoading)) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <GlassNavBar
        title={isHirobaMode ? '広場の設定' : '設定'}
        onBack={onBack}
        rightLabel={isHirobaMode ? '完了' : undefined}
        onRight={isHirobaMode ? onBack : undefined}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {/* ── 基本情報（広場モードのみ） ── */}
          {isHirobaMode && (
            <AnimatedSection index={0}>
              <Text style={styles.sectionTitle} accessibilityRole="header">
                基本情報
              </Text>
              <GlassCard>
                <Text style={styles.label}>広場名</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="広場名を入力"
                  placeholderTextColor={colors.textMuted}
                  returnKeyType="next"
                  accessibilityLabel="広場名"
                />
                <Text style={[styles.label, { marginTop: spacing.md }]}>説明</Text>
                <TextInput
                  style={[styles.input, styles.inputMultiline]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="広場の説明"
                  placeholderTextColor={colors.textMuted}
                  multiline
                  returnKeyType="done"
                  blurOnSubmit
                  onSubmitEditing={() => Keyboard.dismiss()}
                  accessibilityLabel="広場の説明"
                />
              </GlassCard>
            </AnimatedSection>
          )}

          {/* ── メンバー（広場モードのみ） ── */}
          {isHirobaMode && (
            <AnimatedSection index={1}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle} accessibilityRole="header">
                  メンバー
                </Text>
                <PressableScale onPress={() => {}} accessibilityLabel="メンバーを招待">
                  <View style={styles.inviteChip}>
                    <Ionicons name="add" size={14} color={colors.accent} />
                    <Text style={styles.inviteText}>招待</Text>
                  </View>
                </PressableScale>
              </View>
              <GlassCard style={{ padding: 0 }}>
                {(members ?? []).map((member, index) => {
                  const profile = member.profiles;
                  const isOwner = member.role === 'owner';
                  const isLast = index === (members?.length ?? 1) - 1;
                  return (
                    <View
                      key={member.user_id}
                      style={[styles.memberRow, !isLast && styles.memberDivider]}
                      accessible
                      accessibilityLabel={`${profile?.username ?? '不明'}、${isOwner ? '管理者' : 'メンバー'}`}
                    >
                      <View
                        style={[
                          styles.memberAvatar,
                          { backgroundColor: MEMBER_COLORS[index % MEMBER_COLORS.length] },
                        ]}
                      >
                        <Ionicons name="person" size={16} color="rgba(0,0,0,0.35)" />
                      </View>
                      <View style={styles.memberInfo}>
                        <Text style={styles.memberName}>{profile?.username ?? '不明'}</Text>
                        <Text style={styles.memberRole}>{isOwner ? '管理者' : 'メンバー'}</Text>
                      </View>
                      <PressableScale onPress={() => {}} accessibilityLabel="メンバーを編集">
                        <View style={styles.memberAction}>
                          <Ionicons
                            name="ellipsis-horizontal"
                            size={16}
                            color={colors.textSecondary}
                          />
                        </View>
                      </PressableScale>
                    </View>
                  );
                })}
              </GlassCard>
            </AnimatedSection>
          )}

          {/* ── 通知（広場モードのみ） ── */}
          {isHirobaMode && (
            <AnimatedSection index={2}>
              <Text style={styles.sectionTitle} accessibilityRole="header">
                通知
              </Text>
              <GlassCard>
                <View style={styles.switchRow}>
                  <View style={styles.switchText}>
                    <Text style={styles.switchTitle}>新しい投稿</Text>
                    <Text style={styles.switchSubtitle}>メンバーの投稿を通知</Text>
                  </View>
                  <Switch
                    value={notifyPost}
                    onValueChange={handleSwitchToggle(setNotifyPost)}
                    thumbColor={colors.white}
                    trackColor={{ false: '#D8DCE6', true: colors.accent }}
                    accessibilityLabel="新しい投稿の通知"
                    accessibilityRole="switch"
                  />
                </View>
                <View style={styles.divider} />
                <View style={styles.switchRow}>
                  <View style={styles.switchText}>
                    <Text style={styles.switchTitle}>プラン完成</Text>
                    <Text style={styles.switchSubtitle}>AIプラン生成完了を通知</Text>
                  </View>
                  <Switch
                    value={notifyPlan}
                    onValueChange={handleSwitchToggle(setNotifyPlan)}
                    thumbColor={colors.white}
                    trackColor={{ false: '#D8DCE6', true: colors.accent }}
                    accessibilityLabel="プラン完成の通知"
                    accessibilityRole="switch"
                  />
                </View>
              </GlassCard>
            </AnimatedSection>
          )}

          {/* ── アカウント ── */}
          <AnimatedSection index={isHirobaMode ? 3 : 0}>
            <Text style={styles.sectionTitle} accessibilityRole="header">
              アカウント
            </Text>
            <GlassCard>
              <PressableScale
                onPress={handleLogout}
                hapticStyle={Haptics.ImpactFeedbackStyle.Medium}
                accessibilityLabel="ログアウト"
              >
                <View style={styles.logoutRow}>
                  <Ionicons name="log-out-outline" size={20} color={colors.textSecondary} />
                  <Text style={styles.logoutText}>ログアウト</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </View>
              </PressableScale>
            </GlassCard>
          </AnimatedSection>

          {/* ── 危険な操作（広場モードのみ） ── */}
          {isHirobaMode && (
            <AnimatedSection index={4}>
              <Text style={styles.sectionTitle} accessibilityRole="header">
                危険な操作
              </Text>
              <GlassCard style={styles.dangerCard}>
                <PressableScale
                  onPress={handleDelete}
                  hapticStyle={Haptics.ImpactFeedbackStyle.Heavy}
                  accessibilityLabel="広場を削除"
                >
                  <View style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={18} color="#FF5C6C" />
                    <Text style={styles.deleteText}>広場を削除</Text>
                  </View>
                </PressableScale>
              </GlassCard>
            </AnimatedSection>
          )}

          <View style={{ height: spacing.xxl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── スタイル ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingTop: 110,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: fonts.heading,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ── 入力 ──
  label: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.textMuted,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: glass.borderRadius.md,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    paddingHorizontal: spacing.md,
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.ink,
  },
  inputMultiline: {
    height: 84,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },

  // ── メンバー ──
  inviteChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255, 77, 141, 0.08)',
  },
  inviteText: {
    fontSize: 12,
    fontFamily: fonts.heading,
    color: colors.accent,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  memberDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontFamily: fonts.heading,
    color: colors.ink,
  },
  memberRole: {
    fontSize: 11,
    fontFamily: fonts.body,
    color: colors.textMuted,
    marginTop: 2,
  },
  memberAction: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── 通知 ──
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  switchText: {
    flex: 1,
    marginRight: spacing.md,
  },
  switchTitle: {
    fontSize: 14,
    fontFamily: fonts.heading,
    color: colors.ink,
  },
  switchSubtitle: {
    fontSize: 11,
    fontFamily: fonts.body,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    marginVertical: spacing.xs,
  },

  // ── ログアウト ──
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 2,
  },
  logoutText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.heading,
    color: colors.textSecondary,
  },

  // ── 危険な操作 ──
  dangerCard: {
    borderColor: 'rgba(255, 92, 108, 0.15)',
    backgroundColor: 'rgba(255, 92, 108, 0.04)',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: '#FF5C6C',
  },
  deleteText: {
    fontSize: 14,
    fontFamily: fonts.heading,
    color: '#FF5C6C',
  },
});
