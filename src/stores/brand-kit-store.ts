import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QRCustomization } from '@/types/qr';

export interface BrandKit {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  patternStyle: QRCustomization['patternStyle'];
  cornerStyle: QRCustomization['cornerStyle'];
  createdAt: number;
}

interface BrandKitState {
  kits: BrandKit[];
  activeKitId: string | null;
  saveKit: (kit: Omit<BrandKit, 'id' | 'createdAt'>) => string;
  updateKit: (id: string, patch: Partial<BrandKit>) => void;
  deleteKit: (id: string) => void;
  setActive: (id: string | null) => void;
  applyToCustomization: (id: string, base: QRCustomization) => QRCustomization | null;
}

export const useBrandKitStore = create<BrandKitState>()(
  persist(
    (set, get) => ({
      kits: [],
      activeKitId: null,

      saveKit: (kit) => {
        const id = crypto.randomUUID();
        set((state) => ({
          kits: [...state.kits, { ...kit, id, createdAt: Date.now() }],
        }));
        return id;
      },

      updateKit: (id, patch) => {
        set((state) => ({
          kits: state.kits.map((k) => (k.id === id ? { ...k, ...patch } : k)),
        }));
      },

      deleteKit: (id) => {
        set((state) => ({
          kits: state.kits.filter((k) => k.id !== id),
          activeKitId: state.activeKitId === id ? null : state.activeKitId,
        }));
      },

      setActive: (id) => set({ activeKitId: id }),

      applyToCustomization: (id, base) => {
        const kit = get().kits.find((k) => k.id === id);
        if (!kit) return null;
        return {
          ...base,
          foregroundColor: kit.primaryColor,
          backgroundColor: kit.secondaryColor,
          logo: kit.logo ?? base.logo,
          patternStyle: kit.patternStyle,
          cornerStyle: kit.cornerStyle,
        };
      },
    }),
    {
      name: 'qr-brand-kits',
    }
  )
);
