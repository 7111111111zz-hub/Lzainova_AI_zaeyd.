import React, { createContext, useCallback, useEffect, useMemo, useState, ReactNode } from 'react';
import { memoryStore, UserPreferences } from '@/services/memoryStore';

interface SettingsContextValue {
  prefs: UserPreferences;
  instructions: string;
  longTerm: string[];
  updatePrefs: (p: Partial<UserPreferences>) => Promise<void>;
  saveInstructions: (t: string) => Promise<void>;
  clearLongTerm: () => Promise<void>;
}

const DEFAULT: UserPreferences = {
  theme: 'dark',
  language: 'ar',
  memoryEnabled: true,
  streaming: true,
};

export const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT);
  const [instructions, setInstructions] = useState('');
  const [longTerm, setLongTerm] = useState<string[]>([]);

  const load = useCallback(async () => {
    setPrefs(await memoryStore.getPreferences());
    setInstructions(await memoryStore.getInstructions());
    setLongTerm(await memoryStore.getLongTerm());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updatePrefs = useCallback(async (p: Partial<UserPreferences>) => {
    const next = await memoryStore.setPreferences(p);
    setPrefs(next);
  }, []);

  const saveInstructions = useCallback(async (t: string) => {
    await memoryStore.setInstructions(t);
    setInstructions(t);
  }, []);

  const clearLongTerm = useCallback(async () => {
    await memoryStore.clearLongTerm();
    setLongTerm([]);
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({ prefs, instructions, longTerm, updatePrefs, saveInstructions, clearLongTerm }),
    [prefs, instructions, longTerm, updatePrefs, saveInstructions, clearLongTerm],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
