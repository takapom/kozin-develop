import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { glass } from '../../theme/glass';

type GlassCardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export const GlassCard = React.memo<GlassCardProps>(
  ({ children, style }) => {
    return (
      <View style={[styles.card, style]}>
        {children}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    borderRadius: glass.borderRadius.lg,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: glass.border.visible,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
});
