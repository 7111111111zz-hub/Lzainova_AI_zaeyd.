import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Font, Radii, Spacing } from '@/constants/theme';

export type PlusAction = 'file' | 'image' | 'project' | 'code' | 'document' | 'tools' | 'task' | 'mic';

interface Props {
  onAction: (a: PlusAction) => void;
  onClose: () => void;
}

const ITEMS: { key: PlusAction; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; color: string }[] = [
  { key: 'file', label: 'ملف', icon: 'paperclip', color: '#4A9EFF' },
  { key: 'image', label: 'صورة', icon: 'image-outline', color: '#A855F7' },
  { key: 'project', label: 'مشروع', icon: 'folder-outline', color: '#F5C542' },
  { key: 'code', label: 'كود', icon: 'code-tags', color: '#22C55E' },
  { key: 'document', label: 'مستند', icon: 'file-document-outline', color: '#F59E0B' },
  { key: 'tools', label: 'أدوات Lzainova', icon: 'brain', color: '#EC4899' },
  { key: 'task', label: 'تنفيذ مهمة', icon: 'lightning-bolt-outline', color: '#F5C542' },
];

export function PlusMenu({ onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.grid}>
        {ITEMS.map((it) => (
          <Pressable
            key={it.key}
            onPress={() => onAction(it.key)}
            style={({ pressed }) => [styles.item, pressed && { transform: [{ scale: 0.96 }] }]}
          >
            <View style={[styles.icon, { backgroundColor: `${it.color}22`, borderColor: `${it.color}55` }]}>
              <MaterialCommunityIcons name={it.icon} size={22} color={it.color} />
            </View>
            <Text style={styles.label}>{it.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  item: {
    width: '23%',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: Radii.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: Font.size.xs,
    fontWeight: Font.weight.medium,
    textAlign: 'center',
  },
});
