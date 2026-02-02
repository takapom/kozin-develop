import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export const HIROBA_COLORS = [
  '#F9B7C7',
  '#B7B9FF',
  '#B7E8D0',
  '#FFE8B5',
  '#DDE8FF',
] as const;

export const HIROBA_ICONS: ComponentProps<typeof Ionicons>['name'][] = [
  'compass-outline',
  'heart-outline',
  'sparkles',
  'planet-outline',
  'rocket-outline',
];

export type HirobaTheme = {
  color: string;
  icon: ComponentProps<typeof Ionicons>['name'];
};

export function getHirobaTheme(index: number): HirobaTheme {
  return {
    color: HIROBA_COLORS[index % HIROBA_COLORS.length],
    icon: HIROBA_ICONS[index % HIROBA_ICONS.length],
  };
}
