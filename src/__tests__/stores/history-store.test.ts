import { useHistoryStore } from '@/stores/history-store';
import { act } from '@testing-library/react';
import { QRHistoryItem } from '@/types/qr';

// Mock localStorage for persist middleware
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('History Store', () => {
  const createHistoryItem = (id: string, label?: string): QRHistoryItem => ({
    id,
    type: 'text',
    data: { text: `Test ${id}` },
    encodedString: `encoded-${id}`,
    previewUrl: `data:image/png;base64,${id}`,
    customization: {
      size: 256,
      foregroundColor: '#000000',
      backgroundColor: '#ffffff',
      errorCorrection: 'M',
      margin: 4,
      pattern: 'square',
      cornerStyle: 'square',
      logoSize: 20,
    },
    createdAt: new Date().toISOString(),
    label,
  });

  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useHistoryStore.setState({ items: [] });
    });
    localStorageMock.clear();
  });

  describe('addItem', () => {
    it('should add item to the beginning of the list', () => {
      const item1 = createHistoryItem('1');
      const item2 = createHistoryItem('2');

      act(() => {
        useHistoryStore.getState().addItem(item1);
      });

      act(() => {
        useHistoryStore.getState().addItem(item2);
      });

      const items = useHistoryStore.getState().items;
      expect(items).toHaveLength(2);
      expect(items[0].id).toBe('2'); // Most recent first
      expect(items[1].id).toBe('1');
    });

    it('should limit history to 50 items', () => {
      // Add 55 items
      act(() => {
        for (let i = 0; i < 55; i++) {
          useHistoryStore.getState().addItem(createHistoryItem(`item-${i}`));
        }
      });

      const items = useHistoryStore.getState().items;
      expect(items).toHaveLength(50);
      expect(items[0].id).toBe('item-54'); // Most recent
      expect(items[49].id).toBe('item-5'); // Oldest kept
    });
  });

  describe('removeItem', () => {
    it('should remove item by id', () => {
      const item1 = createHistoryItem('1');
      const item2 = createHistoryItem('2');
      const item3 = createHistoryItem('3');

      act(() => {
        useHistoryStore.getState().addItem(item1);
        useHistoryStore.getState().addItem(item2);
        useHistoryStore.getState().addItem(item3);
      });

      act(() => {
        useHistoryStore.getState().removeItem('2');
      });

      const items = useHistoryStore.getState().items;
      expect(items).toHaveLength(2);
      expect(items.find((i) => i.id === '2')).toBeUndefined();
    });

    it('should do nothing when removing non-existent id', () => {
      const item = createHistoryItem('1');

      act(() => {
        useHistoryStore.getState().addItem(item);
      });

      act(() => {
        useHistoryStore.getState().removeItem('non-existent');
      });

      expect(useHistoryStore.getState().items).toHaveLength(1);
    });
  });

  describe('updateLabel', () => {
    it('should update label of existing item', () => {
      const item = createHistoryItem('1', 'Original Label');

      act(() => {
        useHistoryStore.getState().addItem(item);
      });

      act(() => {
        useHistoryStore.getState().updateLabel('1', 'New Label');
      });

      const updatedItem = useHistoryStore.getState().items[0];
      expect(updatedItem.label).toBe('New Label');
    });

    it('should not affect other items', () => {
      const item1 = createHistoryItem('1', 'Label 1');
      const item2 = createHistoryItem('2', 'Label 2');

      act(() => {
        useHistoryStore.getState().addItem(item1);
        useHistoryStore.getState().addItem(item2);
      });

      act(() => {
        useHistoryStore.getState().updateLabel('1', 'Updated');
      });

      const items = useHistoryStore.getState().items;
      expect(items.find((i) => i.id === '1')?.label).toBe('Updated');
      expect(items.find((i) => i.id === '2')?.label).toBe('Label 2');
    });
  });

  describe('clearHistory', () => {
    it('should remove all items', () => {
      act(() => {
        useHistoryStore.getState().addItem(createHistoryItem('1'));
        useHistoryStore.getState().addItem(createHistoryItem('2'));
        useHistoryStore.getState().addItem(createHistoryItem('3'));
      });

      expect(useHistoryStore.getState().items).toHaveLength(3);

      act(() => {
        useHistoryStore.getState().clearHistory();
      });

      expect(useHistoryStore.getState().items).toHaveLength(0);
    });
  });

  describe('getItem', () => {
    it('should return item by id', () => {
      const item = createHistoryItem('test-id', 'Test Label');

      act(() => {
        useHistoryStore.getState().addItem(item);
      });

      const result = useHistoryStore.getState().getItem('test-id');
      expect(result).toBeDefined();
      expect(result?.id).toBe('test-id');
      expect(result?.label).toBe('Test Label');
    });

    it('should return undefined for non-existent id', () => {
      const result = useHistoryStore.getState().getItem('non-existent');
      expect(result).toBeUndefined();
    });
  });
});
