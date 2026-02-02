import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { GlassCard } from '../ui/GlassCard';
import { GradientPillButton } from '../button/GradientPillButton';
import { OutlinePillButton } from '../button/OutlinePillButton';
import { colors, fonts, spacing } from '../../theme/tokens';
import { glass } from '../../theme/glass';
import { useExtractImages, useCreatePost } from '../../hooks/useCreatePost';

type PostModalProps = {
  visible: boolean;
  hirobaId: string;
  onClose: () => void;
};

type Step = 'input' | 'select' | 'posting';
type ExtractError = string | null;

export function PostModal({ visible, hirobaId, onClose }: PostModalProps) {
  const [step, setStep] = useState<Step>('input');
  const [url, setUrl] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [extractError, setExtractError] = useState<ExtractError>(null);
  const [postError, setPostError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<{
    images: { url: string; source: string }[];
    title: string | null;
    description: string | null;
  } | null>(null);

  const extractMutation = useExtractImages();
  const createPostMutation = useCreatePost(hirobaId);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
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
      slideAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep('input');
    setUrl('');
    setSelectedImageUrl(null);
    setCaption('');
    setExtractedData(null);
    setExtractError(null);
    setPostError(null);
    onClose();
  };

  const handleExtractImages = async () => {
    if (!url.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Keyboard.dismiss();
    setExtractError(null);

    try {
      const result = await extractMutation.mutateAsync(url.trim());
      if (!result.images || result.images.length === 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setExtractError('このURLからは画像を取得できませんでした。別のページのURLを試してみてください');
        return;
      }
      setExtractedData(result);
      setStep('select');
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const msg = error instanceof Error ? error.message : '';
      if (msg.includes('403') || msg.includes('Forbidden')) {
        setExtractError('このサイトはアクセスが制限されています。別のサイトのURLを貼り付けてみてください');
      } else if (msg.includes('404') || msg.includes('Not Found')) {
        setExtractError('ページが見つかりません。URLが正しいか確認して、もう一度お試しください');
      } else if (msg.includes('non-2xx') || msg.includes('Failed to fetch')) {
        setExtractError('このサイトの画像は取得できませんでした。別のURLを試してみてください');
      } else {
        setExtractError('画像の取得に失敗しました。通信環境を確認して、もう一度お試しください');
      }
    }
  };

  const handleCreatePost = async () => {
    if (!selectedImageUrl) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep('posting');

    try {
      await createPostMutation.mutateAsync({
        image_url: selectedImageUrl,
        caption: caption.trim() || undefined,
        source_url: url.trim(),
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      handleClose();
    } catch (error) {
      console.error('投稿作成エラー:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setPostError('投稿に失敗しました。もう一度お試しください');
      setStep('select');
    }
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

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
        {/* 背景オーバーレイ */}
        <Pressable style={styles.overlay} onPress={handleClose}>
          <Animated.View style={[styles.overlayInner, { opacity: fadeAnim }]}>
            <BlurView intensity={20} style={StyleSheet.absoluteFill} />
          </Animated.View>
        </Pressable>

        {/* モーダルコンテンツ */}
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <GlassCard style={styles.card}>
            {/* ヘッダー */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                {step === 'input' && '📸 投稿する'}
                {step === 'select' && '🖼️ 画像を選択'}
                {step === 'posting' && '✨ 投稿中...'}
              </Text>
              <Pressable
                onPress={handleClose}
                hitSlop={8}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>

            {/* Step 1: URL入力 */}
            {step === 'input' && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepLabel}>URLを入力してください</Text>
                <TextInput
                  style={styles.input}
                  placeholder="https://example.com/article"
                  placeholderTextColor={colors.textMuted}
                  value={url}
                  onChangeText={setUrl}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                  returnKeyType="go"
                  onSubmitEditing={handleExtractImages}
                />

                <View style={styles.buttonRow}>
                  <GradientPillButton
                    label={extractMutation.isPending ? '取得中...' : '画像を取得'}
                    onPress={handleExtractImages}
                    style={styles.primaryButton}
                    height={48}
                  />
                </View>

                {extractError && (
                  <Pressable
                    style={styles.errorBox}
                    onPress={handleExtractImages}
                    accessibilityRole="alert"
                    accessibilityHint="タップでリトライ"
                  >
                    <View style={styles.errorContent}>
                      <Ionicons
                        name="alert-circle"
                        size={16}
                        color={colors.accent}
                      />
                      <Text style={styles.errorText}>
                        {extractError}
                      </Text>
                    </View>
                    <View style={styles.retryRow}>
                      <Ionicons
                        name="reload-outline"
                        size={13}
                        color={colors.accent}
                      />
                      <Text style={styles.retryHint}>タップでリトライ</Text>
                    </View>
                  </Pressable>
                )}
              </View>
            )}

            {/* Step 2: 画像選択 */}
            {step === 'select' && extractedData && (
              <View style={styles.stepContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.imageScrollContent}
                >
                  {extractedData.images.map((img, index) => (
                    <Pressable
                      key={index}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setSelectedImageUrl(img.url);
                      }}
                      style={styles.imageWrapper}
                    >
                      <View
                        style={[
                          styles.imageContainer,
                          selectedImageUrl === img.url && styles.imageSelected,
                        ]}
                      >
                        <Image
                          source={{ uri: img.url }}
                          style={styles.imageThumbnail}
                          resizeMode="cover"
                        />
                        {selectedImageUrl === img.url && (
                          <View style={styles.selectedOverlay}>
                            <View style={styles.selectedBadge}>
                              <Ionicons
                                name="checkmark"
                                size={16}
                                color={colors.white}
                              />
                            </View>
                          </View>
                        )}
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>

                <Text style={styles.stepLabel}>キャプション（任意）</Text>
                <TextInput
                  style={styles.input}
                  placeholder="この場所について..."
                  placeholderTextColor={colors.textMuted}
                  value={caption}
                  onChangeText={setCaption}
                  maxLength={200}
                  multiline
                />

                {postError && (
                  <View style={styles.errorBox} accessibilityRole="alert">
                    <Ionicons
                      name="alert-circle"
                      size={16}
                      color={colors.accent}
                    />
                    <Text style={styles.errorText}>{postError}</Text>
                  </View>
                )}

                <View style={styles.buttonRow}>
                  <OutlinePillButton
                    label="戻る"
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setPostError(null);
                      setStep('input');
                    }}
                    style={styles.secondaryButton}
                    height={48}
                  />
                  <GradientPillButton
                    label="投稿する"
                    onPress={handleCreatePost}
                    style={styles.primaryButton}
                    height={48}
                  />
                </View>
              </View>
            )}

            {/* Step 3: 投稿中 */}
            {step === 'posting' && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.accent} />
                <Text style={styles.loadingText}>投稿しています...</Text>
              </View>
            )}
          </GlassCard>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  overlayInner: {
    flex: 1,
  },
  modalContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
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

  /* ステップコンテンツ */
  stepContainer: {
    gap: spacing.md,
  },
  stepLabel: {
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

  /* 画像選択 */
  imageScrollContent: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  imageWrapper: {
    width: 140,
    height: 140,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: glass.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  imageSelected: {
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  imageThumbnail: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 77, 141, 0.2)',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    padding: spacing.xs,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* エラー表示 */
  errorBox: {
    gap: spacing.xs,
    padding: spacing.sm,
    backgroundColor: 'rgba(255, 77, 141, 0.1)',
    borderRadius: glass.borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 141, 0.2)',
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  errorText: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.accent,
    flex: 1,
  },
  retryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  retryHint: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.accent,
    opacity: 0.7,
  },

  /* ローディング */
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.textSecondary,
  },
});
