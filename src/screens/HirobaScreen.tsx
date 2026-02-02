import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  Animated,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fonts, spacing } from '../theme/tokens';
import { glass } from '../theme/glass';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientPillButton } from '../components/button/GradientPillButton';
import { OutlinePillButton } from '../components/button/OutlinePillButton';
import { AppTabBar, TabKey } from '../components/ui/AppTabBar';
import { PostModal } from '../components/feature/PostModal';
import { useHiroba } from '../hooks/useHiroba';
import { useHirobaPosts } from '../hooks/useHirobaPosts';
import { useHirobaMembers } from '../hooks/useHirobaMembers';
import { relativeTime } from '../utils/relativeTime';
import { getHirobaTheme, HIROBA_COLORS } from '../constants/hirobaTheme';

// ─── 定数 ─────────────────────────────────────────────────
const STAGGER_MS = glass.animation.staggerDelay;
const COLUMN_GAP = 10;
const CARD_PADDING = spacing.md;

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ─── MasonryPostCard ─────────────────────────────────────
// Masonry用の投稿カード（画像を主役にした設計）
function MasonryPostCard({
  post,
  index,
  themeColor,
  onLike,
}: {
  post: any;
  index: number;
  themeColor: string;
  onLike: () => void;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  const profile = post.profiles;

  // 画像の高さをランダムに変化させて Pinterest 風のリズムを作る
  const imageHeights = [180, 220, 160, 200, 240, 190];
  const imageHeight = imageHeights[index % imageHeights.length];

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
    <Animated.View
      style={[
        styles.masonryCard,
        {
          opacity,
          transform: [{ translateY }],
          shadowColor: themeColor,
        },
      ]}
    >
      {/* 画像 */}
      {post.imageUrl ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: post.imageUrl }}
            style={[styles.masonryImage, { height: imageHeight }]}
            resizeMode="cover"
          />
          {/* いいねボタン（フローティング） */}
          <Pressable
            style={styles.floatingLikeButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onLike();
            }}
          >
            <View style={styles.likeButtonInner}>
              <Ionicons
                name={post.likes_count > 0 ? 'heart' : 'heart-outline'}
                size={16}
                color={post.likes_count > 0 ? themeColor : colors.ink}
              />
              {post.likes_count > 0 && (
                <Text style={styles.likeCountText}>{post.likes_count}</Text>
              )}
            </View>
          </Pressable>
        </View>
      ) : (
        <View style={[styles.masonryImage, styles.imagePlaceholder, { height: imageHeight }]}>
          <Ionicons name="image-outline" size={32} color={colors.textMuted} />
        </View>
      )}

      {/* 下部の情報エリア */}
      <View style={styles.cardInfo}>
        <View style={styles.userRow}>
          <View
            style={[
              styles.userAvatar,
              { backgroundColor: HIROBA_COLORS[index % HIROBA_COLORS.length] },
            ]}
          >
            <Ionicons name="person" size={10} color={colors.white} />
          </View>
          <View style={styles.userTextArea}>
            <Text style={styles.userName} numberOfLines={1}>
              {profile?.username ?? '不明'}
            </Text>
            <Text style={styles.postTimeText}>{relativeTime(post.created_at)}</Text>
          </View>
        </View>

        {post.caption ? (
          <Text style={styles.captionText} numberOfLines={1}>
            {post.caption}
          </Text>
        ) : null}
      </View>
    </Animated.View>
  );
}

// ─── PressableScale ──────────────────────────────────────
function PressableScale({
  onPress,
  children,
  style,
}: {
  onPress: () => void;
  children: React.ReactNode;
  style?: object;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
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
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        hitSlop={6}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

// ─── メイン画面 ──────────────────────────────────────────
type HirobaScreenProps = {
  hirobaId: string;
  themeIndex?: number;
  onBack?: () => void;
  onOpenSettings?: () => void;
};

export function HirobaScreen({
  hirobaId,
  themeIndex = 0,
  onBack,
  onOpenSettings,
}: HirobaScreenProps) {
  const { data: hiroba } = useHiroba(hirobaId);
  const { data: posts, isLoading: postsLoading } = useHirobaPosts(hirobaId);
  const { data: members } = useHirobaMembers(hirobaId);

  const [postModalVisible, setPostModalVisible] = useState(false);

  const theme = getHirobaTheme(themeIndex);

  // Masonry用に左右2列に振り分ける
  const [leftColumn, setLeftColumn] = useState<any[]>([]);
  const [rightColumn, setRightColumn] = useState<any[]>([]);

  useEffect(() => {
    if (posts && posts.length > 0) {
      const left: any[] = [];
      const right: any[] = [];

      posts.forEach((post, index) => {
        if (index % 2 === 0) {
          left.push(post);
        } else {
          right.push(post);
        }
      });

      setLeftColumn(left);
      setRightColumn(right);
    }
  }, [posts]);

  const handleTabPress = (tab: TabKey) => {
    if (tab === 'home') {
      onBack?.();
      return;
    }
    if (tab === 'settings') {
      onOpenSettings?.();
    }
  };

  const handleLike = () => {
    // いいね処理（実装予定）
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* 投稿モーダル */}
      <PostModal
        visible={postModalVisible}
        hirobaId={hirobaId}
        onClose={() => setPostModalVisible(false)}
      />

      {/* ── カラーグラデーション背景 ── */}
      <LinearGradient
        colors={[
          hexToRgba(theme.color, 0.18),
          hexToRgba(theme.color, 0.06),
          colors.background,
        ]}
        locations={[0, 0.35, 0.7]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* ── ナビゲーションバー ── */}
        <View style={styles.navBar}>
          <PressableScale onPress={() => onBack?.()}>
            <View style={[styles.navButton, { backgroundColor: hexToRgba(theme.color, 0.12) }]}>
              <Ionicons name="chevron-back" size={20} color={colors.ink} />
            </View>
          </PressableScale>

          <Text style={styles.navTitle} numberOfLines={1}>
            {hiroba?.title ?? ''}
          </Text>

          <PressableScale onPress={() => onOpenSettings?.()}>
            <View style={[styles.navButton, { backgroundColor: hexToRgba(theme.color, 0.12) }]}>
              <Ionicons name="ellipsis-horizontal" size={18} color={colors.ink} />
            </View>
          </PressableScale>
        </View>

        {/* ── コンパクトなメタ情報バー ── */}
        <View style={styles.metaBar}>
          <View style={styles.avatarRow}>
            {(members ?? []).slice(0, 4).map((member, i) => (
              <View
                key={member.user_id}
                style={[
                  styles.metaAvatar,
                  {
                    backgroundColor: HIROBA_COLORS[i % HIROBA_COLORS.length],
                    marginLeft: i > 0 ? -6 : 0,
                    zIndex: 4 - i,
                  },
                ]}
              >
                <Ionicons name="person" size={10} color={colors.white} />
              </View>
            ))}
          </View>
          <Text style={styles.metaText}>
            {members?.length ?? 0}人 · {posts?.length ?? 0}枚
          </Text>
        </View>

        {/* ── スクロール領域（Masonryグリッド） ── */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {postsLoading ? (
            <ActivityIndicator
              size="large"
              color={theme.color}
              style={{ marginTop: spacing.xl }}
            />
          ) : !posts || posts.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="camera-outline" size={48} color={theme.color} />
              </View>
              <Text style={styles.emptyTitle}>スクショを投げ込もう！</Text>
              <Text style={styles.emptyDescription}>
                気になった場所やお店の画像を共有して{'\n'}みんなでプランを作ろう
              </Text>
            </View>
          ) : (
            <View style={styles.masonryContainer}>
              {/* 左列 */}
              <View style={styles.masonryColumn}>
                {leftColumn.map((post, index) => (
                  <MasonryPostCard
                    key={post.id}
                    post={post}
                    index={index * 2}
                    themeColor={theme.color}
                    onLike={handleLike}
                  />
                ))}
              </View>

              {/* 右列 */}
              <View style={styles.masonryColumn}>
                {rightColumn.map((post, index) => (
                  <MasonryPostCard
                    key={post.id}
                    post={post}
                    index={index * 2 + 1}
                    themeColor={theme.color}
                    onLike={handleLike}
                  />
                ))}
              </View>
            </View>
          )}

          <View style={{ height: spacing.xxl }} />
        </ScrollView>
      </SafeAreaView>

      {/* ── ボトムアクション（優先度逆転） ── */}
      <View style={styles.bottomArea}>
        <View style={styles.actionRow}>
          <GradientPillButton
            label="投稿する"
            icon="📸"
            style={styles.actionButton}
            height={44}
            paddingHorizontal={10}
            textStyle={styles.actionButtonText}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setPostModalVisible(true);
            }}
          />
          <OutlinePillButton
            label="プランを作る"
            icon="✨"
            style={styles.actionButton}
            paddingHorizontal={10}
            textStyle={styles.actionButtonText}
          />
        </View>
        <AppTabBar active="home" onTabPress={handleTabPress} />
      </View>
    </View>
  );
}

// ─── スタイル ────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },

  /* ── ナビゲーションバー ── */
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: glass.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: fonts.heading,
    color: colors.ink,
    marginHorizontal: spacing.sm,
  },

  /* ── コンパクトなメタ情報バー ── */
  metaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  metaText: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.textSecondary,
  },

  /* ── スクロールコンテンツ ── */
  scrollContent: {
    paddingBottom: spacing.xxl,
    paddingTop: spacing.xs,
  },

  /* ── 空状態 ── */
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
    paddingHorizontal: spacing.lg,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: glass.borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: fonts.heading,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  emptyDescription: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  /* ── Masonryグリッド ── */
  masonryContainer: {
    flexDirection: 'row',
    paddingHorizontal: CARD_PADDING,
    gap: COLUMN_GAP,
  },
  masonryColumn: {
    flex: 1,
  },
  masonryCard: {
    borderRadius: glass.borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: glass.border.visible,
    marginBottom: COLUMN_GAP,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    overflow: 'hidden',
  },

  /* ── 投稿カード（画像主役） ── */
  imageContainer: {
    position: 'relative',
  },
  masonryImage: {
    width: '100%',
    borderTopLeftRadius: glass.borderRadius.lg,
    borderTopRightRadius: glass.borderRadius.lg,
  },
  imagePlaceholder: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ── フローティングいいねボタン ── */
  floatingLikeButton: {
    position: 'absolute',
    bottom: spacing.xs,
    right: spacing.xs,
  },
  likeButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 6,
    borderRadius: glass.borderRadius.sm,
    borderWidth: 1,
    borderColor: glass.border.subtle,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  likeCountText: {
    fontSize: 11,
    fontFamily: fonts.heading,
    color: colors.ink,
  },

  /* ── カード下部情報エリア ── */
  cardInfo: {
    padding: spacing.sm,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  userAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  userTextArea: {
    flex: 1,
  },
  userName: {
    fontSize: 11,
    fontFamily: fonts.heading,
    color: colors.ink,
    marginBottom: 2,
  },
  postTimeText: {
    fontSize: 10,
    fontFamily: fonts.body,
    color: colors.textMuted,
  },
  captionText: {
    fontSize: 11,
    fontFamily: fonts.body,
    color: colors.textSecondary,
    lineHeight: 16,
  },

  /* ── ボトムアクション（優先度逆転） ── */
  bottomArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: glass.border.subtle,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  actionButton: {
    flex: 1,
    height: 44,
  },
  actionButtonText: {
    fontSize: 15,
    lineHeight: 18,
    letterSpacing: -0.2,
  },
});
