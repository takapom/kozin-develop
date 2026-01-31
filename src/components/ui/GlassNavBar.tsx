import React from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fonts, spacing } from '../../theme/tokens';
import { glass } from '../../theme/glass';

type GlassNavBarProps = {
  title: string;
  onBack?: () => void;
  rightLabel?: string;
  onRight?: () => void;
};

export const GlassNavBar = React.memo<GlassNavBarProps>(
  ({ title, onBack, rightLabel, onRight }) => {
    const handleBack = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onBack?.();
    };

    const handleRight = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onRight?.();
    };

    return (
      <View style={styles.container}>
        <SafeAreaView>
          <View style={styles.bar}>
            {onBack ? (
              <Pressable
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed && styles.pressed,
                ]}
                onPress={handleBack}
                accessibilityRole="button"
                accessibilityLabel="戻る"
                hitSlop={8}
              >
                <Ionicons name="chevron-back" size={20} color={colors.ink} />
              </Pressable>
            ) : (
              <View style={styles.iconButton} />
            )}

            <Text style={styles.title} accessibilityRole="header">
              {title}
            </Text>

            {rightLabel && onRight ? (
              <Pressable
                style={({ pressed }) => [
                  styles.rightButton,
                  pressed && styles.pressed,
                ]}
                onPress={handleRight}
                accessibilityRole="button"
                accessibilityLabel={rightLabel}
              >
                <Text style={styles.rightText}>{rightLabel}</Text>
              </Pressable>
            ) : (
              <View style={styles.iconButton} />
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: glass.border.subtle,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: glass.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.heading,
    color: colors.ink,
  },
  rightButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: glass.borderRadius.sm,
  },
  rightText: {
    fontSize: 14,
    fontFamily: fonts.heading,
    color: colors.accent,
  },
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
});
