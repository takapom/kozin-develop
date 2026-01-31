import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, radii, shadows, spacing } from '../theme/tokens';
import { GradientPillButton } from '../components/button/GradientPillButton';
import { OutlinePillButton } from '../components/button/OutlinePillButton';
import { AppTabBar, TabKey } from '../components/ui/AppTabBar';

type HirobaScreenProps = {
  onBack?: () => void;
  onOpenSettings?: () => void;
};

const posts = [
  {
    id: 'ramen',
    user: 'みさき',
    time: '5分前',
    emoji: '🍜',
    title: '新しいラーメン屋！',
    likes: 2,
    tint: '#FDE6DF',
  },
  {
    id: 'sakura',
    user: 'けんた',
    time: '12分前',
    emoji: '🌸',
    title: '夜桜スポット',
    likes: 3,
    tint: '#ECE7FF',
  },
];

export function HirobaScreen({ onBack, onOpenSettings }: HirobaScreenProps) {
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
          <Text style={styles.topTitle}>今週末の渋谷🏙️</Text>
          <Pressable style={styles.iconButton} onPress={onOpenSettings} hitSlop={8}>
            <Text style={styles.iconButtonText}>•••</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.memberCard}>
            <View style={styles.avatarRow}>
              <View style={[styles.avatarCircle, { backgroundColor: '#FFD6C2' }]}>
                <Text style={styles.avatarEmoji}>👩</Text>
              </View>
              <View style={[styles.avatarCircle, { backgroundColor: '#FFE8B5', marginLeft: -10 }]}>
                <Text style={styles.avatarEmoji}>👨</Text>
              </View>
              <View style={[styles.avatarCircle, { backgroundColor: '#FBD6E3', marginLeft: -10 }]}>
                <Text style={styles.avatarEmoji}>👧</Text>
              </View>
            </View>
            <Text style={styles.memberText}>3人のメンバー</Text>
            <Pressable style={styles.inviteButton}>
              <Text style={styles.inviteText}>＋ 招待</Text>
            </Pressable>
          </View>

          <View style={styles.grid}>
            {posts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.postUser}>
                    <View style={styles.postAvatar}>
                      <Text style={styles.postAvatarEmoji}>👧</Text>
                    </View>
                    <Text style={styles.postName}>{post.user}</Text>
                  </View>
                  <Text style={styles.postTime}>{post.time}</Text>
                </View>

                <View style={[styles.postImage, { backgroundColor: post.tint }]}>
                  <Text style={styles.postEmoji}>{post.emoji}</Text>
                </View>

                <Text style={styles.postTitle}>{post.title}</Text>

                <View style={styles.postFooter}>
                  <Text style={styles.postLike}>👍 {post.likes}</Text>
                  <Text style={styles.postAction}>👍 いいね</Text>
                </View>
              </View>
            ))}
          </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
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
