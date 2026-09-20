import React, { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Font, Radii, Spacing } from '@/constants/theme';
import { PlusMenu, PlusAction } from './PlusMenu';

interface Props {
  onSend: (text: string) => void;
  onCancel?: () => void;
  isStreaming?: boolean;
  onAction: (action: PlusAction) => void;
}

export function ChatInput({ onSend, onCancel, isStreaming, onAction }: Props) {
  const [text, setText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const canSend = text.trim().length > 0 && !isStreaming;

  const submit = useCallback(() => {
    if (!canSend) return;
    onSend(text.trim());
    setText('');
  }, [canSend, onSend, text]);

  const handleAction = (a: PlusAction) => {
    setMenuOpen(false);
    onAction(a);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
    >
      {menuOpen ? <PlusMenu onAction={handleAction} onClose={() => setMenuOpen(false)} /> : null}
      <View style={styles.wrap}>
        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
          onPress={() => setMenuOpen((s) => !s)}
          hitSlop={10}
        >
          <MaterialCommunityIcons
            name={menuOpen ? 'close' : 'plus'}
            size={22}
            color={Colors.textSecondary}
          />
        </Pressable>

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="اسأل Lzainova AI..."
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
          multiline
          textAlign="right"
          onSubmitEditing={submit}
        />

        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
          onPress={() => onAction('mic')}
          hitSlop={10}
        >
          <MaterialCommunityIcons name="microphone-outline" size={22} color={Colors.textSecondary} />
        </Pressable>

        {isStreaming ? (
          <Pressable
            style={({ pressed }) => [styles.sendBtn, styles.stopBtn, pressed && { opacity: 0.85 }]}
            onPress={onCancel}
            hitSlop={10}
          >
            <MaterialCommunityIcons name="stop" size={20} color="#fff" />
          </Pressable>
        ) : (
          <Pressable
            disabled={!canSend}
            onPress={submit}
            style={({ pressed }) => [
              styles.sendBtn,
              !canSend && styles.sendBtnDisabled,
              pressed && canSend && { transform: [{ scale: 0.95 }] },
            ]}
            hitSlop={10}
          >
            <MaterialCommunityIcons name="send" size={18} color="#fff" />
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: Spacing.md,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 10 : 14,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Font.size.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    maxHeight: 120,
    minHeight: 40,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.brand,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.brand,
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.surfaceElevated,
    shadowOpacity: 0,
    elevation: 0,
  },
  stopBtn: {
    backgroundColor: Colors.error,
    shadowColor: Colors.error,
  },
});
