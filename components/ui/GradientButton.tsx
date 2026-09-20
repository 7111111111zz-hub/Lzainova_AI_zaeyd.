import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Font, Radii, Spacing } from '@/constants/theme';

interface GradientButtonProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'gold' | 'ghost';
  style?: ViewStyle;
  compact?: boolean;
}

export function GradientButton({
  label,
  onPress,
  disabled,
  variant = 'primary',
  style,
  compact,
}: GradientButtonProps) {
  const colors =
    variant === 'gold'
      ? [Colors.gold, Colors.goldDeep]
      : variant === 'ghost'
      ? [Colors.surfaceElevated, Colors.surface]
      : [Colors.brand, Colors.brandDeep];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.wrap,
        style,
        compact && styles.compact,
        pressed && !disabled && { transform: [{ scale: 0.98 }] },
        disabled && { opacity: 0.45 },
      ]}
    >
      <LinearGradient
        colors={colors as unknown as readonly [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.inner}
      >
        <Text style={[styles.text, variant === 'gold' && { color: '#1a1200' }]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: Radii.pill,
    overflow: 'hidden',
  },
  compact: { alignSelf: 'flex-start' },
  inner: {
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: Font.size.md,
    fontWeight: Font.weight.semibold,
    letterSpacing: 0.3,
  },
});
