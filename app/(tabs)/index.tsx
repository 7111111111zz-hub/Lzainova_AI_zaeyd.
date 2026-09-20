import React, { useEffect, useRef } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useChat } from '@/hooks/useChat';
import { useTasks } from '@/hooks/useTasks';
import { useAlert } from '@/template';
import { Screen } from '@/components/layout/Screen';
import { AppHeader } from '@/components/layout/AppHeader';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { TaskProgressCard } from '@/components/tasks/TaskProgressCard';
import { PlusAction } from '@/components/chat/PlusMenu';
import { routeIntent } from '@/services/agents/intentRouter';
import { Colors, Spacing } from '@/constants/theme';

export default function ChatScreen() {
  const { messages, isStreaming, sendMessage, cancel, addSystemMessage } = useChat();
  const { tasks, startTask } = useTasks();
  const { showAlert } = useAlert();
  const listRef = useRef<FlatList>(null);

  const activeTask = tasks.find((t) => t.status === 'RUNNING' || t.status === 'QUEUED');

  useEffect(() => {
    if (listRef.current && messages.length > 0) {
      setTimeout(() => {
        try {
          listRef.current?.scrollToEnd({ animated: true });
        } catch {}
      }, 60);
    }
  }, [messages.length]);

  const handleSend = async (text: string) => {
    const intent = routeIntent(text);
    if (intent === 'task') {
      addSystemMessage(`تم توجيه الطلب إلى Task Agent — تابع التقدم أعلاه.`);
      await startTask(text);
      return;
    }
    await sendMessage(text);
  };

  const handleAction = (a: PlusAction) => {
    const map: Record<PlusAction, string> = {
      file: 'رفع الملفات سيتصل بـ Lzainova Private API عند تفعيل الخادم.',
      image: 'دعم الصور جاهز في الواجهة، وسيتصل بـ Vision Agent عند تفعيل الخادم.',
      project: 'إنشاء مشروع كامل يشغّل Task Agent مع تسلسل خطوات.',
      code: 'Coding Agent جاهز — الصق الكود في المحادثة أو استخدم صفحة Code.',
      document: 'قراءة المستندات ستمر عبر File Agent مع صلاحيات محددة.',
      tools: 'أدوات Lzainova الداخلية (Memory, Verification, Sandbox).',
      task: 'اكتب هدفًا واضحًا وسيبدأ Task Agent بتنفيذه.',
      mic: 'محرك Speech-to-Text سيُوصل عند إعداد الخادم.',
    };
    showAlert('Lzainova AI', map[a]);
  };

  return (
    <Screen edges={['top']}>
      <StatusBar style="light" />
      <AppHeader subtitle="Router · Chat · Task · Coding · Memory" />
      <View style={{ flex: 1 }}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            activeTask ? (
              <View style={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.md }}>
                <TaskProgressCard task={activeTask} compact={false} />
              </View>
            ) : null
          }
        />
      </View>
      <ChatInput
        onSend={handleSend}
        onCancel={cancel}
        isStreaming={isStreaming}
        onAction={handleAction}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.background,
    flexGrow: 1,
  },
});
