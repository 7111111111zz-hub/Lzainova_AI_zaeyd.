import AsyncStorage from '@react-native-async-storage/async-storage';

// Memory Store — short-term (session), long-term (persistent), user preferences.
// Real backend can mirror this shape.

const K = {
  longTerm: 'lz.memory.longTerm',
  instructions: 'lz.memory.instructions',
  preferences: 'lz.memory.preferences',
};

export interface UserPreferences {
  theme: 'dark' | 'light';
  language: 'ar' | 'en';
  memoryEnabled: boolean;
  streaming: boolean;
}

const DEFAULT_PREFS: UserPreferences = {
  theme: 'dark',
  language: 'ar',
  memoryEnabled: true,
  streaming: true,
};

export const memoryStore = {
  async getLongTerm(): Promise<string[]> {
    const raw = await AsyncStorage.getItem(K.longTerm);
    return raw ? JSON.parse(raw) : [];
  },
  async addLongTerm(item: string): Promise<void> {
    const cur = await memoryStore.getLongTerm();
    const next = [item, ...cur].slice(0, 100);
    await AsyncStorage.setItem(K.longTerm, JSON.stringify(next));
  },
  async clearLongTerm(): Promise<void> {
    await AsyncStorage.removeItem(K.longTerm);
  },
  async getInstructions(): Promise<string> {
    return (await AsyncStorage.getItem(K.instructions)) ?? '';
  },
  async setInstructions(text: string): Promise<void> {
    await AsyncStorage.setItem(K.instructions, text);
  },
  async getPreferences(): Promise<UserPreferences> {
    const raw = await AsyncStorage.getItem(K.preferences);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  },
  async setPreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
    const cur = await memoryStore.getPreferences();
    const next = { ...cur, ...prefs };
    await AsyncStorage.setItem(K.preferences, JSON.stringify(next));
    return next;
  },
};
