import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSettings } from '@/hooks/useSettings';
import { useAlert } from '@/template';
import { Screen } from '@/components/layout/Screen';
import { AppHeader } from '@/components/layout/AppHeader';
import { Colors, Font, Radii, Spacing } from '@/constants/theme';
import AppConfig from '@/constants/config';

export default function SettingsScreen() {
  const { prefs, instructions, longTerm, updatePrefs, saveInstructions, clearLongTerm } = useSettings();
  const { showAlert } = useAlert();
  const [draft, setDraft] = useState(instructions);
  const [endpoint, setEndpoint] = useState(AppConfig.apiBase);

  const confirmClear = () => {
    showAlert('مسح الذاكرة', 'سيتم حذف الذاكرة طويلة المدى. هل أنت متأكد؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'مسح',
        style: 'destructive',
        onPress: async () => {
          await clearLongTerm();
          showAlert('تم', 'تم مسح الذاكرة بنجاح.');
        },
      },
    ]);
  };

  return (
    <Screen edges={['top']}>
      <AppHeader subtitle="الإعدادات · الذاكرة · محرك الذكاء" />
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.lg }}>
        <Section title="محرك الذكاء الاصطناعي" icon="brain">
          <Row label="المحرك النشط" value={AppConfig.aiEngine} />
          <Row label="خادم Inference" value={endpoint || 'غير محدد'} />
          <TextInput
            value={endpoint}
            onChangeText={setEndpoint}
            placeholder="https://your-lzainova-api.example.com"
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            autoCapitalize="none"
          />
          <Hint>
            استبدل هذا العنوان بعنوان Lzainova Private API الخاص بك. عند تفعيله سيتم توجيه المحادثات
            إلى محركك مباشرة.
          </Hint>
        </Section>

        <Section title="التفضيلات" icon="tune">
          <ToggleRow
            label="تفعيل الذاكرة"
            desc="حفظ سياق المحادثات وتعليمات دائمة."
            value={prefs.memoryEnabled}
            onChange={(v) => updatePrefs({ memoryEnabled: v })}
          />
          <ToggleRow
            label="Streaming Responses"
            desc="عرض الرد كلمة بكلمة عبر SSE/WebSocket."
            value={prefs.streaming}
            onChange={(v) => updatePrefs({ streaming: v })}
          />
          <ToggleRow
            label="الوضع الليلي"
            desc="واجهة داكنة مستقبلية (Dark)."
            value={prefs.theme === 'dark'}
            onChange={(v) => updatePrefs({ theme: v ? 'dark' : 'light' })}
          />
        </Section>

        <Section title="تعليمات دائمة" icon="notebook-outline">
          <Hint>يمرَّر هذا النص إلى النموذج مع كل محادثة (System prompt).</Hint>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="مثال: أجب دائمًا بالعربية الفصحى واختصر النقاط."
            placeholderTextColor={Colors.textMuted}
            style={[styles.input, { minHeight: 90, textAlignVertical: 'top' }]}
            multiline
          />
          <Pressable
            style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.85 }]}
            onPress={async () => {
              await saveInstructions(draft);
              showAlert('تم', 'تم حفظ التعليمات.');
            }}
          >
            <Text style={styles.saveBtnText}>حفظ التعليمات</Text>
          </Pressable>
        </Section>

        <Section title="الذاكرة طويلة المدى" icon="database-outline">
          <Row label="عدد العناصر" value={String(longTerm.length)} />
          <Pressable
            style={({ pressed }) => [styles.dangerBtn, pressed && { opacity: 0.85 }]}
            onPress={confirmClear}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={18} color={Colors.error} />
            <Text style={styles.dangerBtnText}>مسح الذاكرة</Text>
          </Pressable>
        </Section>

        <Section title="عن Lzainova AI" icon="shield-lock-outline">
          <Row label="الإصدار" value={AppConfig.version} />
          <Row label="السيادة" value="Private · Self-hosted ready" />
          <Hint>
            هذا التطبيق مصمَّم ليعمل مع خادم Inference خاص. لا يعتمد على أي مزود LLM خارجي كجزء
            أساسي من النظام.
          </Hint>
        </Section>
      </ScrollView>
    </Screen>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name={icon} size={18} color={Colors.gold} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={{ gap: 10 }}>{children}</View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function ToggleRow({
  label,
  desc,
  value,
  onChange,
}: {
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDesc}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: Colors.brand, false: Colors.border }}
        thumbColor="#fff"
      />
    </View>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return <Text style={styles.hint}>{children}</Text>;
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Font.size.md,
    fontWeight: Font.weight.semibold,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  rowLabel: {
    color: Colors.textSecondary,
    fontSize: Font.size.base,
    fontWeight: Font.weight.medium,
  },
  rowValue: {
    color: Colors.textPrimary,
    fontSize: Font.size.sm,
    maxWidth: '55%',
  },
  rowDesc: {
    color: Colors.textMuted,
    fontSize: Font.size.xs,
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: Spacing.md,
  },
  input: {
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    padding: Spacing.md,
    fontSize: Font.size.base,
  },
  hint: {
    color: Colors.textMuted,
    fontSize: Font.size.xs,
    lineHeight: 18,
  },
  saveBtn: {
    backgroundColor: Colors.brand,
    borderRadius: Radii.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: Font.weight.semibold,
    fontSize: Font.size.base,
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.error,
    paddingVertical: 12,
    backgroundColor: 'rgba(239,68,68,0.08)',
  },
  dangerBtnText: {
    color: Colors.error,
    fontWeight: Font.weight.semibold,
  },
});
