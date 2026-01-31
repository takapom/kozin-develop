import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  Switch,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, radii, shadows, spacing } from '../theme/tokens';

type HirobaSettingsScreenProps = {
  onBack?: () => void;
};

const members = [
  { id: 'm1', name: 'みさき', role: '管理者', color: '#FBD6E3' },
  { id: 'm2', name: 'けんた', role: 'メンバー', color: '#FFE8B5' },
  { id: 'm3', name: 'ゆい', role: 'メンバー', color: '#DDE8FF' },
];

export function HirobaSettingsScreen({ onBack }: HirobaSettingsScreenProps) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <Pressable style={styles.iconButton} onPress={onBack}>
            <Text style={styles.iconButtonText}>←</Text>
          </Pressable>
          <Text style={styles.topTitle}>広場の設定</Text>
          <Pressable style={styles.doneButton} onPress={onBack}>
            <Text style={styles.doneText}>完了</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>基本情報</Text>
            <View style={styles.card}>
              <Text style={styles.label}>広場名</Text>
              <TextInput
                style={styles.input}
                defaultValue="今週末の渋谷"
                placeholder="広場名を入力"
                placeholderTextColor={colors.textMuted}
              />
              <Text style={[styles.label, styles.labelSpacing]}>説明</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                defaultValue="週末に行きたい場所を集めよう"
                placeholder="広場の説明"
                placeholderTextColor={colors.textMuted}
                multiline
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>メンバー</Text>
              <Pressable style={styles.inviteButton}>
                <Text style={styles.inviteText}>＋ 招待</Text>
              </Pressable>
            </View>
            <View style={styles.card}>
              {members.map((member) => (
                <View key={member.id} style={styles.memberRow}>
                  <View style={[styles.memberAvatar, { backgroundColor: member.color }]}>
                    <Text style={styles.memberEmoji}>👤</Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberRole}>{member.role}</Text>
                  </View>
                  <Pressable style={styles.memberAction}>
                    <Text style={styles.memberActionText}>編集</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>通知</Text>
            <View style={styles.card}>
              <View style={styles.switchRow}>
                <View>
                  <Text style={styles.switchTitle}>新しい投稿</Text>
                  <Text style={styles.switchSubtitle}>メンバーの投稿を通知</Text>
                </View>
                <Switch value thumbColor={colors.white} trackColor={{ false: '#D8DCE6', true: colors.accent }} />
              </View>
              <View style={[styles.switchRow, styles.switchRowDivider]}>
                <View>
                  <Text style={styles.switchTitle}>プラン完成</Text>
                  <Text style={styles.switchSubtitle}>AIプラン生成完了を通知</Text>
                </View>
                <Switch value={false} thumbColor={colors.white} trackColor={{ false: '#D8DCE6', true: colors.accent }} />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>危険な操作</Text>
            <View style={styles.card}>
              <Pressable style={styles.deleteButton}>
                <Text style={styles.deleteText}>広場を削除</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.xxl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  iconButtonText: {
    fontSize: 16,
    color: colors.ink,
  },
  topTitle: {
    fontSize: 16,
    fontFamily: fonts.heading,
    color: colors.ink,
  },
  doneButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    ...shadows.soft,
  },
  doneText: {
    fontSize: 12,
    fontFamily: fonts.heading,
    color: colors.accent,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: fonts.heading,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.lg,
    ...shadows.soft,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  labelSpacing: {
    marginTop: spacing.md,
  },
  input: {
    height: 48,
    borderRadius: radii.card,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.md,
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.ink,
  },
  inputMultiline: {
    height: 84,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  inviteButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: '#FFF1F6',
  },
  inviteText: {
    fontSize: 12,
    fontFamily: fonts.heading,
    color: colors.accent,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  memberEmoji: {
    fontSize: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontFamily: fonts.heading,
    color: colors.ink,
  },
  memberRole: {
    fontSize: 11,
    fontFamily: fonts.body,
    color: colors.textMuted,
    marginTop: 2,
  },
  memberAction: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt,
  },
  memberActionText: {
    fontSize: 11,
    fontFamily: fonts.heading,
    color: colors.textSecondary,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  switchRowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.surfaceAlt,
    marginTop: spacing.sm,
  },
  switchTitle: {
    fontSize: 13,
    fontFamily: fonts.heading,
    color: colors.ink,
  },
  switchSubtitle: {
    fontSize: 11,
    fontFamily: fonts.body,
    color: colors.textMuted,
    marginTop: 2,
  },
  deleteButton: {
    height: 46,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: '#FF5C6C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 13,
    fontFamily: fonts.heading,
    color: '#FF5C6C',
  },
});
