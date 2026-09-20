import React, { createContext, useCallback, useEffect, useMemo, useState, ReactNode } from 'react';
import { LibraryItem, libraryStore } from '@/services/libraryStore';

interface LibraryContextValue {
  items: LibraryItem[];
  refresh: () => Promise<void>;
  remove: (id: string) => Promise<void>;
  rename: (id: string, title: string) => Promise<void>;
}

export const LibraryContext = createContext<LibraryContextValue | undefined>(undefined);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LibraryItem[]>([]);

  const refresh = useCallback(async () => {
    const list = await libraryStore.list();
    setItems(list);
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 3000);
    return () => clearInterval(t);
  }, [refresh]);

  const remove = useCallback(
    async (id: string) => {
      await libraryStore.remove(id);
      await refresh();
    },
    [refresh],
  );

  const rename = useCallback(
    async (id: string, title: string) => {
      await libraryStore.rename(id, title);
      await refresh();
    },
    [refresh],
  );

  const value = useMemo<LibraryContextValue>(() => ({ items, refresh, remove, rename }), [items, refresh, remove, rename]);
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}
