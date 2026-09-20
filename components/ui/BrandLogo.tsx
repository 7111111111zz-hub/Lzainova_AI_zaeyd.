import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Font, Radii, Spacing } from '@/constants/theme';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function BrandLogo({ size = 'md', showTagline = false }: BrandLogoProps) {
  const dim = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const nameSize = size === 'sm' ? 15 : size === 'lg' ? 22 : 18;
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={[Colors.brand, Colors.brandDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.mark, { width: dim, height: dim, borderRadius: dim / 3 }]}
      >
        <View style={[styles.markInner, { width: dim * 0.55, height: dim * 0.55 }]}>
          <View style={[styles.dot, { backgroundColor: Colors.gold }]} />
        </View>
      </LinearGradient>
      <View style={{ marginLeft: Spacing.sm }}>
        <Text style={[styles.name, { fontSize: nameSize }]}>
          Lzainova <Text style={{ color: Colors.gold }}>AI</Text>
        </Text>
        {showTagline ? <Text style={styles.tagline}>Private Intelligence</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center' },
  mark: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.brand,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  markInner: {
    borderRadius: Radii.pill,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  name: {
    color: Colors.textPrimary,
    fontWeight: Font.weight.bold,
    letterSpacing: 0.3,
  },
  tagline: {
    color: Colors.textMuted,
    fontSize: Font.size.xs,
    marginTop: 2,
    letterSpacing: 0.5,
  },
});
