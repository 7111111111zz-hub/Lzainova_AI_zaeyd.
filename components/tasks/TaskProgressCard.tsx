import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TaskRun } from '@/services/agents/taskAgent';
import { Colors, Font, Radii, Spacing } from '@/constants/theme';

interface Props {
  task: TaskRun;
  compact?: boolean;
}

export function TaskProgressCard({ task, compact }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="rocket-launch-outline" size={18} color={Colors.gold} />
        <Text style={styles.title} numberOfLines={1}>
          {task.goal}
        </Text>
        <View style={[styles.statusPill, statusStyle(task.status)]}>
          <Text style={styles.statusText}>{statusLabel(task.status)}</Text>
        </View>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.round(task.progress * 100)}%` }]} />
      </View>
      {!compact && (
        <View style={{ marginTop: Spacing.md, gap: 8 }}>
          {task.steps.map((s) => (
            <View key={s.id} style={styles.stepRow}>
              <StepIcon status={s.status} />
              <Text
                style={[
                  styles.stepText,
                  s.status === 'done' && { color: Colors.textSecondary },
                  s.status === 'running' && { color: Colors.gold, fontWeight: Font.weight.semibold },
                ]}
              >
                {s.title}
              </Text>
            </View>
          ))}
        </View>
      )}
      {task.result ? <Text style={styles.result}>{task.result}</Text> : null}
    </View>
  );
}

function StepIcon({ status }: { status: string }) {
  if (status === 'done') return <MaterialCommunityIcons name="check-circle" size={18} color={Colors.success} />;
  if (status === 'running') return <MaterialCommunityIcons name="loading" size={18} color={Colors.gold} />;
  if (status === 'failed') return <MaterialCommunityIcons name="close-circle" size={18} color={Colors.error} />;
  return <MaterialCommunityIcons name="circle-outline" size={18} color={Colors.textDim} />;
}

function statusLabel(s: TaskRun['status']) {
  return (
    {
      QUEUED: 'قيد الانتظار',
      RUNNING: 'يعمل',
      WAITING: 'انتظار',
      COMPLETED: 'مكتمل',
      FAILED: 'فشل',
      CANCELLED: 'ملغى',
    } as const
  )[s];
}

function statusStyle(s: TaskRun['status']) {
  const map: Record<string, { backgroundColor: string; borderColor: string }> = {
    QUEUED: { backgroundColor: 'rgba(179,185,218,0.1)', borderColor: Colors.border },
    RUNNING: { backgroundColor: 'rgba(245,197,66,0.15)', borderColor: Colors.gold },
    WAITING: { backgroundColor: 'rgba(74,158,255,0.1)', borderColor: Colors.brand },
    COMPLETED: { backgroundColor: 'rgba(34,197,94,0.15)', borderColor: Colors.success },
    FAILED: { backgroundColor: 'rgba(239,68,68,0.15)', borderColor: Colors.error },
    CANCELLED: { backgroundColor: 'rgba(179,185,218,0.1)', borderColor: Colors.border },
  };
  return map[s];
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    padding: Spacing.lg,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Font.size.md,
    fontWeight: Font.weight.semibold,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radii.pill,
    borderWidth: 1,
  },
  statusText: {
    color: Colors.textPrimary,
    fontSize: Font.size.xs,
    fontWeight: Font.weight.semibold,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.surfaceMuted,
    borderRadius: 3,
    marginTop: Spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.gold,
  },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepText: { color: Colors.textMuted, fontSize: Font.size.base },
  result: {
    marginTop: Spacing.md,
    color: Colors.success,
    fontSize: Font.size.sm,
    lineHeight: 20,
  },
});
