import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { GlassCard } from '../ui/GlassCard';
import { GradientPillButton } from '../button/GradientPillButton';
import { OutlinePillButton } from '../button/OutlinePillButton';
import { colors, fonts, spacing } from '../../theme/tokens';
import { glass } from '../../theme/glass';
import { useCreateHiroba } from '../../hooks/useCreateHiroba';

type CreateHirobaModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreated?: (hirobaId: string) => void;
};

export function CreateHirobaModal({
  visible,
  onClose,
  onCreated,
}: CreateHirobaModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreateHiroba();

  // 中央スケールアニメーション（0.9→1）
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // モーダル表示アニメーション: 中央スケール + フェード
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: glass.animation.spring.damping,
          stiffness: glass.animation.spring.stiffness,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // モーダル非表示時にリセット
      scaleAnim.setValue(0.9);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const handleClose = () => {
    if (createMutation.isPending) return; // 作成中は閉じない
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTitle('');
    setDescription('');
    setError(null);
    onClose();
  };

  const handleCreate = async () => {
    if (!title.trim() || createMutation.isPending) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Keyboard.dismiss();
    setError(null);

    try {
      const hiroba = await createMutation.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTitle('');
      setDescription('');
      onClose();
      onCreated?.(hiroba.id);
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError('広場の作成に失敗しました。もう一度お試しください。');
    }
  };

  // タイトル未入力時または作成中はボタン無効化
  const isValid = title.trim().length > 0 && !createMutation.isPending;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        {/* 背景オーバーレイ（タップで閉じる） */}
        <Pressable style={styles.overlay} onPress={handleClose}>
          <Animated.View style={[styles.overlayInner, { opacity: fadeAnim }]}>
            <BlurView intensity={20} style={StyleSheet.absoluteFill} />
          </Animated.View>
        </Pressable>

        {/* モーダルコンテンツ（中央配置 + スケールアニメーション） */}
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <GlassCard style={styles.card}>
            {/* ヘッダー */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>🌟 広場をつくる</Text>
              <Pressable
                onPress={handleClose}
                hitSlop={8}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>

            {/* フォーム */}
            <View style={styles.form}>
              <Text style={styles.label}>タイトル（必須）</Text>
              <TextInput
                style={styles.input}
                placeholder="例: 今週末の渋谷"
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={setTitle}
                autoFocus
                returnKeyType="next"
                maxLength={50}
              />

              <Text style={styles.label}>説明（任意）</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="この広場の目的を書いてみよう"
                placeholderTextColor={colors.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                maxLength={200}
              />

              {/* エラー表示 */}
              {error && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={16} color={colors.accent} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* ボタン（横並び2つ） */}
              <View style={styles.buttonRow}>
                <OutlinePillButton
                  label="キャンセル"
                  onPress={handleClose}
                  style={styles.secondaryButton}
                  height={48}
                />
                <GradientPillButton
                  label={createMutation.isPending ? '作成中...' : '作成する'}
                  onPress={handleCreate}
                  style={[
                    styles.primaryButton,
                    !isValid && styles.buttonDisabled,
                  ]}
                  height={48}
                />
              </View>
            </View>
          </GlassCard>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  overlayInner: {
    flex: 1,
  },
  modalContent: {
    position: 'absolute',
    width: '85%',
    maxWidth: 400,
  },
  card: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },

  /* ヘッダー */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fonts.heading,
    color: colors.ink,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: glass.borderRadius.sm,
  },

  /* フォーム */
  form: {
    gap: spacing.md,
  },
  label: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: glass.borderRadius.md,
    borderWidth: 1,
    borderColor: glass.border.subtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.ink,
    minHeight: 48,
  },
  textArea: {
    minHeight: 80,
    paddingTop: spacing.sm,
  },

  /* ボタン */
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  primaryButton: {
    flex: 1,
  },
  secondaryButton: {
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.5,
  },

  /* エラー表示 */
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    backgroundColor: 'rgba(255, 77, 141, 0.1)',
    borderRadius: glass.borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 141, 0.2)',
  },
  errorText: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.accent,
    flex: 1,
  },
});
