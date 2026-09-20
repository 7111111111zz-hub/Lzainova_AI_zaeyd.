import AsyncStorage from '@react-native-async-storage/async-storage';

// Library — persistent index of conversations, projects, files, tasks.

export type LibraryKind = 'conversation' | 'project' | 'file' | 'task';

export interface LibraryItem {
  id: string;
  kind: LibraryKind;
  title: string;
  subtitle?: string;
  createdAt: number;
  updatedAt: number;
  meta?: Record<string, string>;
}

const KEY = 'lz.library.items';

export const libraryStore = {
  async list(): Promise<LibraryItem[]> {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  },
  async save(items: LibraryItem[]): Promise<void> {
    await AsyncStorage.setItem(KEY, JSON.stringify(items));
  },
  async add(item: Omit<LibraryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<LibraryItem> {
    const now = Date.now();
    const full: LibraryItem = {
      id: `lib_${now}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now,
      updatedAt: now,
      ...item,
    };
    const cur = await libraryStore.list();
    await libraryStore.save([full, ...cur]);
    return full;
  },
  async remove(id: string): Promise<void> {
    const cur = await libraryStore.list();
    await libraryStore.save(cur.filter((x) => x.id !== id));
  },
  async rename(id: string, title: string): Promise<void> {
    const cur = await libraryStore.list();
    const next = cur.map((x) => (x.id === id ? { ...x, title, updatedAt: Date.now() } : x));
    await libraryStore.save(next);
  },
};
