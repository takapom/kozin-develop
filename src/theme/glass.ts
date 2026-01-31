/**
 * Liquid Glass デザイントークン
 * iOS 26 の Liquid Glass 美学に基づくガラス質感の定義
 */
export const glass = {
  background: {
    light: 'rgba(255, 255, 255, 0.12)',
    medium: 'rgba(255, 255, 255, 0.18)',
    heavy: 'rgba(255, 255, 255, 0.25)',
  },
  border: {
    subtle: 'rgba(255, 255, 255, 0.15)',
    visible: 'rgba(255, 255, 255, 0.25)',
    bright: 'rgba(255, 255, 255, 0.4)',
  },
  blur: {
    light: 15,
    medium: 30,
    heavy: 50,
  },
  shadow: {
    color: 'rgba(0, 0, 0, 0.08)',
    offset: { width: 0, height: 4 },
    radius: 16,
  },
  borderRadius: {
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
  },
  animation: {
    spring: { damping: 15, stiffness: 150 },
    springLight: { damping: 12, stiffness: 200 },
    staggerDelay: 60,
  },
} as const;
