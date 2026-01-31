import React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { colors, fonts, radii } from '../../theme/tokens';

type OutlinePillButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  height?: number;
  paddingHorizontal?: number;
};

export function OutlinePillButton({
  label,
  onPress,
  icon,
  style,
  textStyle,
  height = 44,
  paddingHorizontal = 16,
}: OutlinePillButtonProps) {
  return (
    <Pressable
      style={[styles.button, { height, paddingHorizontal }, style]}
      onPress={onPress}
      accessibilityRole="button"
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  text: {
    fontSize: 13,
    fontFamily: fonts.heading,
    color: colors.accent,
    lineHeight: 16,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
