import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ChatMessage } from '@/contexts/ChatContext';
import { Colors, Font, Radii, Spacing } from '@/constants/theme';

interface Props {
  message: ChatMessage;
}

export const MessageBubble = React.memo(function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const badge = useMemo(() => {
    if (!message.intent || isUser === false) return null;
    const map: Record<string, { label: string; color: string }> = {
      chat: { label: 'محادثة', color: Colors.brand },
      task: { label: 'مهمة', color: Colors.gold },
      code: { label: 'كود', color: '#22C55E' },
      file: { label: 'ملف', color: '#A855F7' },
    };
    const b = map[message.intent];
    return b ? (
      <View style={[styles.badge, { borderColor: b.color }]}>
        <Text style={[styles.badgeText, { color: b.color }]}>{b.label}</Text>
      </View>
    ) : null;
  }, [message.intent, isUser]);

  if (isSystem) {
    return (
      <View style={styles.systemWrap}>
        <MaterialCommunityIcons name="information-outline" size={14} color={Colors.textMuted} />
        <Text style={styles.systemText}>{message.content}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAi]}>
      {!isUser && (
        <LinearGradient
          colors={[Colors.brand, Colors.brandDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <View style={styles.avatarDot} />
        </LinearGradient>
      )}
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAi,
        ]}
      >
        {badge}
        <Text style={[styles.text, isUser && { color: Colors.textPrimary }]}>
          {message.content}
          {message.streaming ? <Text style={{ color: Colors.gold }}>▍</Text> : null}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  rowUser: { justifyContent: 'flex-end' },
  rowAi: { justifyContent: 'flex-start' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.gold,
  },
  bubble: {
    maxWidth: '82%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Radii.lg,
    borderWidth: 1,
  },
  bubbleUser: {
    backgroundColor: Colors.userBubble,
    borderColor: Colors.border,
    borderBottomRightRadius: 4,
  },
  bubbleAi: {
    backgroundColor: Colors.aiBubble,
    borderColor: Colors.borderSubtle,
    borderBottomLeftRadius: 4,
  },
  text: {
    color: Colors.textPrimary,
    fontSize: Font.size.md,
    lineHeight: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: Radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: Font.size.xs,
    fontWeight: Font.weight.semibold,
  },
  systemWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    marginBottom: Spacing.md,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  systemText: {
    color: Colors.textMuted,
    fontSize: Font.size.xs,
  },
});
