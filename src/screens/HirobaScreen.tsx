import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, radii, shadows, spacing } from '../theme/tokens';
import { GradientPillButton } from '../components/button/GradientPillButton';
import { OutlinePillButton } from '../components/button/OutlinePillButton';
import { AppTabBar, TabKey } from '../components/ui/AppTabBar';
import { useHiroba } from '../hooks/useHiroba';
import { useHirobaPosts } from '../hooks/useHirobaPosts';
import { useHirobaMembers } from '../hooks/useHirobaMembers';
import { relativeTime } from '../utils/relativeTime';

const AVATAR_COLORS = ['#FFD6C2', '#FFE8B5', '#FBD6E3', '#DDE8FF', '#B7E8D0'];

type HirobaScreenProps = {
  hirobaId: string;
  onBack?: () => void;
  onOpenSettings?: () => void;
};

export function HirobaScreen({ hirobaId, onBack, onOpenSettings }: HirobaScreenProps) {
  const { data: hiroba } = useHiroba(hirobaId);
  const { data: posts, isLoading: postsLoading } = useHirobaPosts(hirobaId);
  const { data: members } = useHirobaMembers(hirobaId);

  const handleTabPress = (tab: TabKey) => {
    if (tab === 'home') {
      onBack?.();
      return;
    }
    if (tab === 'settings') {
      onOpenSettings?.();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <Pressable style={styles.iconButton} onPress={onBack}>
            <Text style={styles.iconButtonText}>←</Text>
          </Pressable>
          <Text style={styles.topTitle}>{hiroba?.title ?? '読み込み中...'}</Text>
          <Pressable style={styles.iconButton} onPress={onOpenSettings} hitSlop={8}>
            <Text style={styles.iconButtonText}>•••</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.memberCard}>
            <View style={styles.avatarRow}>
              {(members ?? []).slice(0, 3).map((member, i) => (
                <View
                  key={member.user_id}
                  style={[
                    styles.avatarCircle,
                    {
                      backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
                      marginLeft: i > 0 ? -10 : 0,
                    },
                  ]}
                >
                  <Text style={styles.avatarEmoji}>👤</Text>
                </View>
              ))}
            </View>
            <Text style={styles.memberText}>
              {members?.length ?? 0}人のメンバー
            </Text>
            <Pressable style={styles.inviteButton}>
              <Text style={styles.inviteText}>＋ 招待</Text>
            </Pressable>
          </View>

          {postsLoading ? (
            <ActivityIndicator
              size="large"
              color={colors.accent}
              style={{ marginTop: spacing.xl }}
            />
          ) : !posts || posts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>まだ投稿がありません</Text>
              <Text style={styles.emptySubtext}>
                スクショを投稿してプランを作ろう
              </Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {posts.map((post) => {
                const profile = post.profiles;
                return (
                  <View key={post.id} style={styles.postCard}>
                    <View style={styles.postHeader}>
                      <View style={styles.postUser}>
                        <View style={styles.postAvatar}>
                          <Text style={styles.postAvatarEmoji}>👤</Text>
                        </View>
                        <Text style={styles.postName}>
                          {profile?.username ?? '不明'}
                        </Text>
                      </View>
                      <Text style={styles.postTime}>
                        {relativeTime(post.created_at)}
                      </Text>
                    </View>

                    {post.imageUrl ? (
                      <Image
                        source={{ uri: post.imageUrl }}
                        style={styles.postImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.postImage, styles.postImagePlaceholder]}>
                        <Text style={styles.postEmoji}>📷</Text>
                      </View>
                    )}

                    {post.caption ? (
                      <Text style={styles.postTitle} numberOfLines={2}>
                        {post.caption}
                      </Text>
                    ) : null}

                    <View style={styles.postFooter}>
                      <Text style={styles.postLike}>👍 {post.likes_count}</Text>
                      <Text style={styles.postAction}>👍 いいね</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <View style={styles.bottomArea}>
        <View style={styles.actionRow}>
          <OutlinePillButton
            label="投稿する"
            icon="📸"
            style={styles.actionButton}
            paddingHorizontal={10}
            textStyle={styles.actionButtonText}
          />
          <GradientPillButton
            label="プランを作る"
            icon="✨"
            style={styles.actionButton}
            height={44}
            paddingHorizontal={10}
            textStyle={styles.actionButtonText}
          />
        </View>
        <AppTabBar active="home" onTabPress={handleTabPress} />
      </View>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  iconButtonText: {
    fontSize: 16,
    color: colors.ink,
  },
  topTitle: {
    fontSize: 16,
    fontFamily: fonts.heading,
    color: colors.ink,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    ...shadows.soft,
    marginBottom: spacing.lg,
  },
  avatarRow: {
    flexDirection: 'row',
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 16,
  },
  memberText: {
    marginLeft: spacing.sm,
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.textSecondary,
    flex: 1,
  },
  inviteButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: '#FFF1F6',
  },
  inviteText: {
    fontSize: 12,
    fontFamily: fonts.heading,
    color: colors.accent,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.heading,
    color: colors.textSecondary,
  },
  emptySubtext: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  postCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.soft,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  postUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAvatar: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#FDE2E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  postAvatarEmoji: {
    fontSize: 14,
  },
  postName: {
    fontSize: 12,
    fontFamily: fonts.heading,
    color: colors.ink,
  },
  postTime: {
    fontSize: 10,
    fontFamily: fonts.body,
    color: colors.textMuted,
  },
  postImage: {
    height: 94,
    borderRadius: radii.card,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  postImagePlaceholder: {
    backgroundColor: '#F3F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postEmoji: {
    fontSize: 32,
  },
  postTitle: {
    fontSize: 12,
    fontFamily: fonts.heading,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  postLike: {
    fontSize: 11,
    fontFamily: fonts.body,
    color: colors.textSecondary,
  },
  postAction: {
    fontSize: 11,
    fontFamily: fonts.heading,
    color: colors.accent,
  },
  bottomArea: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceAlt,
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
