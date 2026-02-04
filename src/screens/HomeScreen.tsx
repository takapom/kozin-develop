import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { colors, fonts, radii, shadows, spacing } from '../theme/tokens';
import { glass } from '../theme/glass';
import { GlassCard } from '../components/ui/GlassCard';
import { AppTabBar, TabKey } from '../components/ui/AppTabBar';
import { useAuth } from '../contexts/AuthContext';
import { useMyHirobas } from '../hooks/useMyHirobas';
import { useDeleteHiroba } from '../hooks/useDeleteHiroba';
import { relativeTime } from '../utils/relativeTime';
import { HIROBA_COLORS, HIROBA_ICONS } from '../constants/hirobaTheme';
import { CreateHirobaModal } from '../components/feature/CreateHirobaModal';

const DOT_COLORS = HIROBA_COLORS;
const DOT_ICONS = HIROBA_ICONS;

/** DOT_COLOR の hex を opacity 0.15 の rgba に変換する */
function toShadowColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.15)`;
}

type HomeScreenProps = {
  onSelectHiroba?: (id: string, themeIndex: number) => void;
  onOpenSettings?: () => void;
};

export function HomeScreen({
  onSelectHiroba,
  onOpenSettings,
}: HomeScreenProps) {
  const { profile } = useAuth();
  const { data: hirobas, isLoading } = useMyHirobas();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const deleteMutation = useDeleteHiroba();

  const handleDeleteHiroba = (hirobaId: string, title: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(title, 'この広場を削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(hirobaId);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } catch (err) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('エラー', '削除に失敗しました。もう一度お試しください。');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>おはよう</Text>
              <Text style={styles.name}>{profile?.username ?? 'ゲスト'}</Text>
            </View>
            <LinearGradient
              colors={[colors.avatarStart, colors.avatarEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarIcon}>👤</Text>
            </LinearGradient>
          </View>

          <Pressable
            style={styles.ctaCard}
            onPress={() => setShowCreateModal(true)}
          >
            <LinearGradient
              colors={[colors.coolStart, colors.coolEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaGradient}
            >
              <View style={styles.ctaIconWrap}>
                <Ionicons name="add" size={20} color={colors.white} />
              </View>
              <View style={styles.ctaTextWrap}>
                <Text style={styles.ctaTitle}>新しい広場をつくる</Text>
                <Text style={styles.ctaSubtitle}>友達と「好き」を集めよう</Text>
              </View>
              <Ionicons name="arrow-forward" size={18} color={colors.white} />
            </LinearGradient>
          </Pressable>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>あなたの広場</Text>
            <Text style={styles.sectionLink}>すべて見る</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={colors.accent}
              style={{ marginTop: spacing.xl }}
            />
          ) : !hirobas || hirobas.length === 0 ? (
            /* ── 空状態 ── */
            <GlassCard style={styles.emptyCard}>
              <Ionicons
                name="compass-outline"
                size={44}
                color={colors.accent}
              />
              <Text style={styles.emptyTitle}>みんなの広場をつくろう</Text>
              <Text style={styles.emptySubtext}>
                スクショを集めてAIプランを作成
              </Text>
            </GlassCard>
          ) : (
            /* ── 広場カードリスト（レイヤード立体パターン） ── */
            hirobas.map((hiroba, index) => {
              const memberCount = hiroba.hiroba_members?.[0]?.count ?? 0;
              const postCount = hiroba.posts?.[0]?.count ?? 0;
              const dotColor = DOT_COLORS[index % DOT_COLORS.length];
              const dotIcon = DOT_ICONS[index % DOT_ICONS.length];

              return (
                <Pressable
                  key={hiroba.id}
                  onPress={() => onSelectHiroba?.(hiroba.id, index)}
                  onLongPress={() => handleDeleteHiroba(hiroba.id, hiroba.title)}
                  delayLongPress={500}
                  style={({ pressed }) => [
                    styles.cardWrapper,
                    pressed && styles.cardPressed,
                  ]}
                >
                  {/* 背面シャドウレイヤー */}
                  <View
                    style={[
                      styles.shadowLayer,
                      {
                        backgroundColor: toShadowColor(dotColor),
                        borderRadius: glass.borderRadius.lg,
                      },
                    ]}
                  />

                  {/* メインカード */}
                  <GlassCard style={styles.mainCard}>
                    {/* カラードット + アイコン */}
                    <View
                      style={[styles.dotIcon, { backgroundColor: dotColor }]}
                    >
                      <Ionicons name={dotIcon} size={22} color={colors.white} />
                    </View>

                    {/* タイトル */}
                    <Text style={styles.hirobaTitle}>{hiroba.title}</Text>

                    {/* 自然言語メタ情報 */}
                    <Text style={styles.hirobaMetaText}>
                      {memberCount}人が参加中 ・ {postCount}枚の写真
                    </Text>

                    {/* メンバーミニセクション */}
                    <View style={styles.miniSection}>
                      <View style={styles.avatarRow}>
                        {Array.from(
                          { length: Math.min(memberCount, 3) },
                          (_, i) => (
                            <View
                              key={i}
                              style={[
                                styles.memberAvatar,
                                {
                                  backgroundColor:
                                    DOT_COLORS[i % DOT_COLORS.length],
                                  marginLeft: i === 0 ? 0 : -8,
                                  zIndex: 3 - i,
                                },
                              ]}
                            >
                              <Ionicons
                                name="person"
                                size={12}
                                color={colors.white}
                              />
                            </View>
                          ),
                        )}
                        {memberCount > 3 && (
                          <View
                            style={[
                              styles.memberAvatar,
                              styles.memberBadge,
                              { marginLeft: -8, zIndex: 0 },
                            ]}
                          >
                            <Text style={styles.badgeText}>
                              +{memberCount - 3}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.timeText}>
                        {relativeTime(hiroba.updated_at)}
                      </Text>
                    </View>
                  </GlassCard>
                </Pressable>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>

      <AppTabBar
        active="home"
        onTabPress={(tab: TabKey) => {
          if (tab === 'settings') onOpenSettings?.();
        }}
      />

      <CreateHirobaModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(hirobaId) => {
          // 作成後に新しい広場へ遷移
          onSelectHiroba?.(hirobaId, 0);
        }}
      />
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
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  /* ── Header ── */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.textMuted,
  },
  name: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.ink,
    marginTop: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    fontSize: 18,
  },

  /* ── CTA ── */
  ctaCard: {
    borderRadius: radii.card,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.soft,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.card,
  },
  ctaIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  ctaTextWrap: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 16,
    fontFamily: fonts.heading,
    color: colors.white,
  },
  ctaSubtitle: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: fonts.body,
    color: 'rgba(255,255,255,0.9)',
  },

  /* ── Section ── */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.heading,
    color: colors.ink,
  },
  sectionLink: {
    fontSize: 12,
    fontFamily: fonts.heading,
    color: colors.accent,
  },

  /* ── レイヤード立体カード ── */
  cardWrapper: {
    marginBottom: spacing.md + 4,
    position: 'relative',
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  shadowLayer: {
    position: 'absolute',
    top: 6,
    left: 4,
    right: 4,
    bottom: -6,
  },
  mainCard: {
    padding: spacing.md,
  },

  /* ── カラードット + アイコン ── */
  dotIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },

  /* ── カード内コンテンツ ── */
  hirobaTitle: {
    fontSize: 16,
    fontFamily: fonts.heading,
    color: colors.ink,
  },
  hirobaMetaText: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.textSecondary,
    marginTop: 4,
  },

  /* ── メンバーミニセクション ── */
  miniSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 12,
    padding: 10,
    marginTop: spacing.sm,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  memberBadge: {
    backgroundColor: colors.textMuted,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: fonts.heading,
    color: colors.white,
  },
  timeText: {
    fontSize: 11,
    fontFamily: fonts.body,
    color: colors.textMuted,
  },

  /* ── 空状態 ── */
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: fonts.heading,
    color: colors.ink,
    marginTop: spacing.sm,
  },
  emptySubtext: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
