import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, radii, shadows, spacing } from '../theme/tokens';

type StyleInput = {
  width: number;
  height: number;
};

const clamp = (min: number, value: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const logoImage = require('../../assets/images/logo.png');
const noiseImage = require('../../assets/images/paper-noise.png');

type TopScreenProps = {
  onStart?: () => void;
};

export function TopScreen({ onStart }: TopScreenProps) {
  const { width, height } = useWindowDimensions();

  const styles = useMemo(() => createStyles({ width, height }), [width, height]);

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
      locations={[0, 0.55, 1]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.container}
    >
      <StatusBar style="light" />

      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />
      <View style={[styles.doodleRing, styles.doodleTop]} />
      <View style={[styles.doodleRing, styles.doodleBottom]} />
      <View style={[styles.doodleLine, styles.doodleLineLeft]} />
      <View style={[styles.doodleLine, styles.doodleLineRight]} />
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Image
          source={noiseImage}
          resizeMode="repeat"
          style={styles.noise}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.logoStack}>
            <View style={styles.logoTicket} />
            <View style={styles.logoTape} />
            <View style={styles.logoCard}>
              <Image source={logoImage} style={styles.logoImage} />
              <View pointerEvents="none" style={styles.logoGloss} />
            </View>
          </View>

          <Text style={styles.title}>PlanLike</Text>
          <Text style={styles.tagline}>
            みんなの「好き」を、{'\n'}
            AIがひとつの物語にする。
          </Text>
        </View>

        <View style={styles.buttonStack}>
          <View pointerEvents="none" style={styles.buttonBacker} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="はじめる"
            onPress={onStart}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonText}>はじめる</Text>
            <Text style={styles.buttonSparkle}>✦</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const createStyles = ({ width, height }: StyleInput) => {
  const logoSize = clamp(88, Math.round(Math.min(width, height) * 0.26), 112);
  const ticketSize = logoSize + 14;
  const buttonWidth = clamp(220, Math.round(width * 0.74), 290);
  const blobLarge = Math.max(width, height) * 0.92;
  const blobSmall = Math.max(width, height) * 0.6;
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
      paddingTop: Math.max(spacing.lg, height * 0.08),
      paddingHorizontal: spacing.lg,
      paddingBottom: Math.max(spacing.lg, height * 0.06),
      justifyContent: 'space-between',
    },
    content: {
      alignItems: 'center',
    },
    blob: {
      position: 'absolute',
      borderRadius: 999,
      backgroundColor: colors.blobStrong,
    },
    blobTop: {
      width: blobLarge,
      height: blobLarge,
      top: -blobLarge * 0.35,
      right: -blobLarge * 0.4,
    },
    blobBottom: {
      width: blobSmall,
      height: blobSmall,
      bottom: -blobSmall * 0.25,
      left: -blobSmall * 0.2,
      backgroundColor: colors.blobSoft,
    },
    doodleLine: {
      position: 'absolute',
      height: 3,
      borderRadius: 2,
      backgroundColor: colors.doodle,
    },
    doodleLineLeft: {
      width: 38,
      top: height * 0.32,
      left: width * 0.12,
      transform: [{ rotate: '14deg' }],
    },
    doodleLineRight: {
      width: 26,
      top: height * 0.52,
      right: width * 0.1,
      transform: [{ rotate: '-18deg' }],
      opacity: 0.8,
    },
    doodleRing: {
      position: 'absolute',
      borderRadius: 999,
      borderWidth: 2,
      borderColor: colors.doodle,
    },
    noise: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.08,
    },
    doodleTop: {
      width: 34,
      height: 34,
      top: height * 0.18,
      left: width * 0.08,
      transform: [{ rotate: '-12deg' }],
    },
    doodleBottom: {
      width: 18,
      height: 18,
      right: width * 0.14,
      bottom: height * 0.22,
      opacity: 0.7,
      transform: [{ rotate: '18deg' }],
    },
    logoStack: {
      width: ticketSize,
      height: ticketSize,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    logoTicket: {
      position: 'absolute',
      width: ticketSize,
      height: ticketSize,
      borderRadius: radii.card,
      backgroundColor: colors.cream,
      top: 6,
      left: -6,
      transform: [{ rotate: '6deg' }],
      opacity: 0.9,
      ...shadows.soft,
    },
    logoTape: {
      position: 'absolute',
      width: Math.round(logoSize * 0.45),
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.tape,
      top: -6,
      left: Math.round(logoSize * 0.18),
      transform: [{ rotate: '-12deg' }],
    },
    logoCard: {
      width: logoSize,
      height: logoSize,
      borderRadius: radii.sticker,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      transform: [{ rotate: '-4deg' }],
      ...shadows.lift,
      overflow: 'hidden',
    },
    logoImage: {
      width: '100%',
      height: '100%',
      borderRadius: radii.sticker,
    },
    logoGloss: {
      position: 'absolute',
      width: Math.round(logoSize * 0.5),
      height: Math.round(logoSize * 0.3),
      borderRadius: 999,
      backgroundColor: colors.gloss,
      top: Math.round(logoSize * 0.12),
      left: Math.round(logoSize * 0.14),
      transform: [{ rotate: '-18deg' }],
    },
    title: {
      fontSize: 32,
      letterSpacing: -0.6,
      color: colors.white,
      fontFamily: fonts.heading,
    },
    tagline: {
      marginTop: spacing.sm,
      fontSize: 15,
      lineHeight: 22,
      color: colors.softWhite,
      textAlign: 'center',
      fontFamily: fonts.body,
    },
    buttonStack: {
      alignSelf: 'center',
      justifyContent: 'center',
    },
    buttonBacker: {
      position: 'absolute',
      width: buttonWidth + 18,
      height: 58,
      borderRadius: radii.pill,
      backgroundColor: colors.buttonBacker,
      top: 6,
      left: -8,
      transform: [{ rotate: '-2deg' }],
    },
    button: {
      alignSelf: 'center',
      height: 52,
      width: buttonWidth,
      borderRadius: radii.pill,
      backgroundColor: colors.paper,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.9)',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.soft,
    },
    buttonPressed: {
      opacity: 0.92,
      transform: [{ translateY: 1 }],
    },
    buttonText: {
      fontSize: 16,
      color: colors.accent,
      letterSpacing: 0.2,
      fontFamily: fonts.heading,
    },
    buttonSparkle: {
      marginLeft: 8,
      fontSize: 14,
      color: colors.accent,
    },
  });
};
