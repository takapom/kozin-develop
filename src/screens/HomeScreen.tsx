import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, radii, shadows, spacing } from '../theme/tokens';
import { AppTabBar } from '../components/ui/AppTabBar';

const hirobas = [
  {
    id: 'shibuya',
    title: 'うんち 🏙️',
    minutes: '5分前',
    members: '👩‍🦰👨‍🦱👩‍🦳 3人',
    posts: '📸 12件',
    dotColor: '#F9B7C7',
  },
  {
    id: 'gradtrip',
    title: '卒業旅行✈️',
    minutes: '2時間前',
    members: '👩‍🦰👨‍🦱👩 4人',
    posts: '📸 28件',
    dotColor: '#B7B9FF',
  },
];

type HomeScreenProps = {
  onSelectHiroba?: (id: string) => void;
};

export function HomeScreen({ onSelectHiroba }: HomeScreenProps) {
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
              <Text style={styles.greeting}>おはよう ☀️</Text>
              <Text style={styles.name}>たかぽん</Text>
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

          <Pressable style={styles.ctaCard}>
            <LinearGradient
              colors={[colors.coolStart, colors.coolEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaGradient}
            >
              <View style={styles.ctaIconWrap}>
                <Text style={styles.ctaIcon}>✨</Text>
              </View>
              <View style={styles.ctaTextWrap}>
                <Text style={styles.ctaTitle}>新しい広場をつくる</Text>
                <Text style={styles.ctaSubtitle}>友達と「好き」を集めよう</Text>
              </View>
              <Text style={styles.ctaArrow}>→</Text>
            </LinearGradient>
          </Pressable>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>あなたの広場</Text>
            <Text style={styles.sectionLink}>すべて見る</Text>
          </View>

          {hirobas.map((hiroba) => (
            <Pressable
              key={hiroba.id}
              style={styles.hirobaCard}
              onPress={() => onSelectHiroba?.(hiroba.id)}
            >
              <View style={[styles.hirobaDot, { backgroundColor: hiroba.dotColor }]} />
              <View style={styles.hirobaInfo}>
                <View style={styles.hirobaHeaderRow}>
                  <Text style={styles.hirobaTitle}>{hiroba.title}</Text>
                  <Text style={styles.hirobaTime}>{hiroba.minutes}</Text>
                </View>
                <View style={styles.hirobaMetaRow}>
                  <Text style={styles.hirobaMeta}>{hiroba.members}</Text>
                  <Text style={styles.hirobaMeta}>{hiroba.posts}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>

      <AppTabBar active="home" />
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
  ctaIcon: {
    fontSize: 18,
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
  ctaArrow: {
    fontSize: 18,
    color: colors.white,
  },
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
  hirobaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    ...shadows.soft,
  },
  hirobaDot: {
    width: 36,
    height: 36,
    borderRadius: 14,
    marginRight: spacing.md,
  },
  hirobaInfo: {
    flex: 1,
  },
  hirobaHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hirobaTitle: {
    fontSize: 14,
    fontFamily: fonts.heading,
    color: colors.ink,
  },
  hirobaTime: {
    fontSize: 11,
    fontFamily: fonts.body,
    color: colors.textMuted,
  },
  hirobaMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  hirobaMeta: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.textSecondary,
  },
});
