import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLibrary } from '@/hooks/useLibrary';
import { useAlert } from '@/template';
import { Screen } from '@/components/layout/Screen';
import { AppHeader } from '@/components/layout/AppHeader';
import { LibraryItem, LibraryKind } from '@/services/libraryStore';
import { Colors, Font, Radii, Spacing } from '@/constants/theme';

const KIND_META: Record<LibraryKind, { label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; color: string }> = {
  conversation: { label: 'محادثات', icon: 'chat-outline', color: Colors.brand },
  project: { label: 'مشاريع', icon: 'folder-outline', color: Colors.gold },
  file: { label: 'ملفات', icon: 'file-outline', color: '#A855F7' },
  task: { label: 'مهام', icon: 'lightning-bolt-outline', color: Colors.success },
};

const FILTERS: (LibraryKind | 'all')[] = ['all', 'conversation', 'task', 'project', 'file'];

export default function LibraryScreen() {
  const { items, remove } = useLibrary();
  const { showAlert } = useAlert();
  const [filter, setFilter] = useState<LibraryKind | 'all'>('all');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (filter !== 'all' && it.kind !== filter) return false;
      if (q && !it.title.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [items, filter, q]);

  const stats = useMemo(() => {
    const counts: Record<string, number> = { conversation: 0, project: 0, file: 0, task: 0 };
    items.forEach((i) => (counts[i.kind] = (counts[i.kind] ?? 0) + 1));
    return counts;
  }, [items]);

  const confirmDelete = (id: string, title: string) => {
    showAlert('حذف العنصر', `هل تريد حذف "${title}"؟`, [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => remove(id) },
    ]);
  };

  return (
    <Screen edges={['top']}>
      <AppHeader subtitle="المكتبة · المحادثات والمشاريع والملفات والمهام" />
      <View style={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, gap: Spacing.md }}>
        <View style={styles.statsRow}>
          {(['conversation', 'task', 'project', 'file'] as LibraryKind[]).map((k) => (
            <View key={k} style={styles.statCard}>
              <MaterialCommunityIcons name={KIND_META[k].icon} size={16} color={KIND_META[k].color} />
              <Text style={styles.statValue}>{stats[k] ?? 0}</Text>
              <Text style={styles.statLabel}>{KIND_META[k].label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={18} color={Colors.textMuted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="بحث في المكتبة..."
            placeholderTextColor={Colors.textMuted}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.filtersWrap}>
          {FILTERS.map((f) => {
            const selected = filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[styles.chip, selected && styles.chipActive]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                  {f === 'all' ? 'الكل' : KIND_META[f as LibraryKind].label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(x) => x.id}
        contentContainerStyle={{ padding: Spacing.lg, gap: 10 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="bookshelf" size={48} color={Colors.textDim} />
            <Text style={styles.emptyTitle}>المكتبة فارغة</Text>
            <Text style={styles.emptyText}>ابدأ محادثة أو مهمة وستُحفظ هنا تلقائيًا.</Text>
          </View>
        }
        renderItem={({ item }) => <LibraryRow item={item} onDelete={() => confirmDelete(item.id, item.title)} />}
      />
    </Screen>
  );
}

function LibraryRow({ item, onDelete }: { item: LibraryItem; onDelete: () => void }) {
  const meta = KIND_META[item.kind];
  return (
    <View style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: `${meta.color}22`, borderColor: `${meta.color}55` }]}>
        <MaterialCommunityIcons name={meta.icon} size={20} color={meta.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {item.title || 'بدون عنوان'}
        </Text>
        {item.subtitle ? (
          <Text style={styles.rowSubtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        ) : null}
      </View>
      <Pressable onPress={onDelete} hitSlop={8} style={({ pressed }) => [styles.trash, pressed && { opacity: 0.6 }]}>
        <MaterialCommunityIcons name="trash-can-outline" size={18} color={Colors.textMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    alignItems: 'flex-start',
    gap: 4,
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: Font.size.xl,
    fontWeight: Font.weight.bold,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: Font.size.xs,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    paddingVertical: 10,
    fontSize: Font.size.base,
  },
  filtersWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: Colors.brand,
    borderColor: Colors.brand,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: Font.size.sm,
    fontWeight: Font.weight.semibold,
  },
  chipTextActive: { color: '#fff' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: Radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  rowTitle: {
    color: Colors.textPrimary,
    fontSize: Font.size.md,
    fontWeight: Font.weight.semibold,
  },
  rowSubtitle: {
    color: Colors.textMuted,
    fontSize: Font.size.sm,
    marginTop: 2,
  },
  trash: {
    padding: 8,
  },
  empty: {
    alignItems: 'center',
    marginTop: Spacing['3xl'],
    gap: 8,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: Font.size.lg,
    fontWeight: Font.weight.semibold,
    marginTop: 8,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: Font.size.sm,
    textAlign: 'center',
    paddingHorizontal: Spacing['3xl'],
  },
});
