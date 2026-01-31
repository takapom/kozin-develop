import React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, radii, shadows } from '../../theme/tokens';

type GradientPillButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: string;
  style?: ViewStyle;
  colorsOverride?: [string, string];
  height?: number;
  textStyle?: TextStyle;
  paddingHorizontal?: number;
};

export function GradientPillButton({
  label,
  onPress,
  icon,
  style,
  colorsOverride,
  height = 52,
  textStyle,
  paddingHorizontal = 16,
}: GradientPillButtonProps) {
  const gradientColors = colorsOverride ?? [colors.gradientStart, colors.gradientEnd];

  return (
    <Pressable style={[styles.wrapper, style]} onPress={onPress} accessibilityRole="button">
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { height, paddingHorizontal }]}
      >
        <Text
          style={[styles.text, textStyle]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
          ellipsizeMode="clip"
        >
          {icon ? `${icon} ` : ''}
          {label}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radii.pill,
    overflow: 'hidden',
    ...shadows.soft,
  },
  gradient: {
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: fonts.heading,
    letterSpacing: 0.2,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
