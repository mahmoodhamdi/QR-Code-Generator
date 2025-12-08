import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QRHistoryItem } from '@/types/qr';

interface HistoryState {
  items: QRHistoryItem[];
  addItem: (item: QRHistoryItem) => void;
  removeItem: (id: string) => void;
  updateLabel: (id: string, label: string) => void;
  clearHistory: () => void;
  getItem: (id: string) => QRHistoryItem | undefined;
}

const MAX_HISTORY_ITEMS = 50;

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const newItems = [item, ...state.items].slice(0, MAX_HISTORY_ITEMS);
          return { items: newItems };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateLabel: (id, label) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, label } : item
          ),
        })),

      clearHistory: () => set({ items: [] }),

      getItem: (id) => get().items.find((item) => item.id === id),
    }),
    {
      name: 'qr-history',
    }
  )
);
