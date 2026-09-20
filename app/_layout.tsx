import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AlertProvider } from '@/template';
import { ChatProvider } from '@/contexts/ChatContext';
import { TasksProvider } from '@/contexts/TasksContext';
import { LibraryProvider } from '@/contexts/LibraryContext';
import { SettingsProvider } from '@/contexts/SettingsContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SettingsProvider>
            <LibraryProvider>
              <TasksProvider>
                <ChatProvider>
                  <StatusBar style="light" />
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      contentStyle: { backgroundColor: '#070919' },
                    }}
                  >
                    <Stack.Screen name="(tabs)" />
                  </Stack>
                </ChatProvider>
              </TasksProvider>
            </LibraryProvider>
          </SettingsProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
