import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, fonts, spacing } from '../../theme/tokens';

export type TabKey = 'home' | 'notice' | 'settings';

type AppTabBarProps = {
  active?: TabKey;
  onTabPress?: (tab: TabKey) => void;
};

const tabs: { key: TabKey; icon: string; label: string }[] = [
  { key: 'home', icon: '🏠', label: 'ホーム' },
  { key: 'notice', icon: '🔔', label: '通知' },
  { key: 'settings', icon: '⚙️', label: '設定' },
];

export function AppTabBar({ active = 'home', onTabPress }: AppTabBarProps) {
  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        const handlePress = onTabPress ? () => onTabPress(tab.key) : undefined;
        return (
          <Pressable
            key={tab.key}
            style={styles.tabItem}
            onPress={handlePress}
            accessibilityRole="button"
            hitSlop={8}
          >
            <Text style={[styles.tabIcon, isActive && styles.tabActive]}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, isActive && styles.tabActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceAlt,
    backgroundColor: colors.surface,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 18,
    color: colors.textMuted,
  },
  tabLabel: {
    marginTop: 2,
    fontSize: 10,
    fontFamily: fonts.body,
    color: colors.textMuted,
  },
  tabActive: {
    color: colors.accent,
  },
});
