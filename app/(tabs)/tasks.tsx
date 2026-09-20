import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTasks } from '@/hooks/useTasks';
import { Screen } from '@/components/layout/Screen';
import { AppHeader } from '@/components/layout/AppHeader';
import { TaskProgressCard } from '@/components/tasks/TaskProgressCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Colors, Font, Radii, Spacing } from '@/constants/theme';

export default function TasksScreen() {
  const { tasks, startTask, clearCompleted } = useTasks();
  const [goal, setGoal] = useState('');

  const submit = async () => {
    const g = goal.trim();
    if (!g) return;
    await startTask(g);
    setGoal('');
  };

  return (
    <Screen edges={['top']}>
      <AppHeader subtitle="Task Agent · تنفيذ الأهداف متعددة الخطوات" />
      <View style={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, gap: Spacing.md }}>
        <View style={styles.launcher}>
          <Text style={styles.launcherTitle}>أطلق مهمة جديدة</Text>
          <Text style={styles.launcherHint}>
            مثال: أنشئ لي تطبيق مهام Android بميزات إشعارات ومزامنة.
          </Text>
          <TextInput
            value={goal}
            onChangeText={setGoal}
            placeholder="اكتب هدف المهمة..."
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            multiline
          />
          <View style={styles.launcherRow}>
            <GradientButton label="بدء التنفيذ" onPress={submit} variant="gold" compact />
            <Pressable onPress={clearCompleted} style={styles.clearBtn}>
              <MaterialCommunityIcons name="broom" size={16} color={Colors.textMuted} />
              <Text style={styles.clearText}>مسح المكتملة</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ padding: Spacing.lg, gap: 10 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="rocket-outline" size={44} color={Colors.textDim} />
            <Text style={styles.emptyTitle}>لا توجد مهام بعد</Text>
            <Text style={styles.emptyText}>ابدأ مهمتك الأولى بتحديد هدف واضح.</Text>
          </View>
        }
        renderItem={({ item }) => <TaskProgressCard task={item} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  launcher: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    gap: 10,
  },
  launcherTitle: {
    color: Colors.textPrimary,
    fontSize: Font.size.lg,
    fontWeight: Font.weight.semibold,
  },
  launcherHint: {
    color: Colors.textMuted,
    fontSize: Font.size.sm,
    lineHeight: 20,
  },
  input: {
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    padding: Spacing.md,
    fontSize: Font.size.base,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  launcherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  clearText: {
    color: Colors.textMuted,
    fontSize: Font.size.sm,
    fontWeight: Font.weight.medium,
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
  },
});
