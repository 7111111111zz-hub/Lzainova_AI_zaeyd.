import React, { createContext, useCallback, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import { aiEngine } from '@/services/aiEngine';
import { AIMessage } from '@/services/aiEngine/types';
import { isQuickChat, routeIntent } from '@/services/agents/intentRouter';
import { libraryStore } from '@/services/libraryStore';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: number;
  streaming?: boolean;
  intent?: 'chat' | 'task' | 'code' | 'file';
}

interface ChatContextValue {
  messages: ChatMessage[];
  isStreaming: boolean;
  sendMessage: (text: string, hasAttachment?: boolean) => Promise<void>;
  cancel: () => void;
  clear: () => void;
  addSystemMessage: (content: string) => void;
}

export const ChatContext = createContext<ChatContextValue | undefined>(undefined);

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'مرحبًا بك في Lzainova AI. هذه منصتك الخاصة — اسألني أي شيء أو أطلق مهمة معقدة عبر زر +.',
  createdAt: Date.now(),
};

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [isStreaming, setIsStreaming] = useState(false);
  const cancelRef = useRef<(() => void) | null>(null);

  const addSystemMessage = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `sys_${Date.now()}`,
        role: 'system',
        content,
        createdAt: Date.now(),
      },
    ]);
  }, []);

  const sendMessage = useCallback(
    async (text: string, hasAttachment = false) => {
      const clean = text.trim();
      if (!clean || isStreaming) return;

      const userMsg: ChatMessage = {
        id: `u_${Date.now()}`,
        role: 'user',
        content: clean,
        createdAt: Date.now(),
        intent: routeIntent(clean, hasAttachment),
      };
      const aiId = `a_${Date.now() + 1}`;
      const aiMsg: ChatMessage = {
        id: aiId,
        role: 'assistant',
        content: '',
        createdAt: Date.now() + 1,
        streaming: true,
      };
      setMessages((prev) => [...prev, userMsg, aiMsg]);
      setIsStreaming(true);

      const history: AIMessage[] = [
        { role: 'system', content: 'أنت Lzainova AI. أجب بإيجاز واحترافية.' },
        ...messages
          .filter((m) => m.role !== 'system')
          .map((m) => ({ role: m.role, content: m.content } as AIMessage)),
        { role: 'user', content: clean },
      ];

      const cancel = await aiEngine.chat(history, {
        onDelta: (delta) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === aiId ? { ...m, content: m.content + delta } : m)),
          );
        },
        onDone: (full) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === aiId ? { ...m, content: full, streaming: false } : m)),
          );
          setIsStreaming(false);
          libraryStore
            .add({
              kind: 'conversation',
              title: clean.slice(0, 40),
              subtitle: full.slice(0, 60),
            })
            .catch(() => {});
        },
        onError: (err) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiId
                ? { ...m, content: `تعذّر إكمال الرد: ${err.message}`, streaming: false }
                : m,
            ),
          );
          setIsStreaming(false);
        },
      });
      cancelRef.current = cancel;
    },
    [isStreaming, messages],
  );

  const cancel = useCallback(() => {
    cancelRef.current?.();
    cancelRef.current = null;
    setIsStreaming(false);
    setMessages((prev) => prev.map((m) => (m.streaming ? { ...m, streaming: false } : m)));
  }, []);

  const clear = useCallback(() => {
    cancel();
    setMessages([WELCOME]);
  }, [cancel]);

  const value = useMemo<ChatContextValue>(
    () => ({ messages, isStreaming, sendMessage, cancel, clear, addSystemMessage }),
    [messages, isStreaming, sendMessage, cancel, clear, addSystemMessage],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
