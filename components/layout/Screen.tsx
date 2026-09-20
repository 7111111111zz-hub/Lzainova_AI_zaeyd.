import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';

interface ScreenProps {
  children: React.ReactNode;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  style?: ViewStyle;
  padded?: boolean;
}

export function Screen({ children, edges = ['top'], style, padded = false }: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={[styles.safe, style]}>
      <View style={[{ flex: 1 }, padded && { paddingHorizontal: 16 }]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
});
