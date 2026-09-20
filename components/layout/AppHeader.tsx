import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Font, Radii, Spacing } from '@/constants/theme';
import { BrandLogo } from '@/components/ui/BrandLogo';

interface Props {
  right?: React.ReactNode;
  subtitle?: string;
}

export function AppHeader({ right, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <BrandLogo showTagline={false} />
        <View style={{ flex: 1 }} />
        <View style={styles.status}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>Private</Text>
        </View>
        {right}
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  statusText: {
    color: Colors.textSecondary,
    fontSize: Font.size.xs,
    fontWeight: Font.weight.semibold,
    letterSpacing: 0.5,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: Font.size.sm,
    marginTop: 4,
  },
});
