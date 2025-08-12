// store/wishlist.ts
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type WishItem = {
  productId: string;
  variantKey?: string | null;
  name?: string | null;
  price?: number | null;
  image?: unknown; // keep whatever you already use (sanity image, url, etc.)
};

type WishlistState = {
  items: WishItem[];
  add: (item: WishItem) => void;
  remove: (productId: string, variantKey?: string | null) => void;
  clear: () => void;

  // hydration guard to avoid SSR/CSR mismatch
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
};

// IMPORTANT:
// - create the store ONCE at module scope (singleton)
// - use `skipHydration: true` and trigger rehydrate in the component
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const key = (i: WishItem) =>
          `${i.productId}::${i.variantKey ?? "base"}`;
        const map = new Map(get().items.map((i) => [key(i), i]));
        map.set(key(item), item);
        set({ items: Array.from(map.values()) });
      },
      remove: (productId, variantKey = null) => {
        set({
          items: get().items.filter(
            (i) =>
              !(
                i.productId === productId &&
                (i.variantKey ?? null) === (variantKey ?? null)
              )
          ),
        });
      },
      clear: () => set({ items: [] }),

      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "wishlist-v1",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          throw new Error("localStorage is not available");
        }
        return window.localStorage;
      }),
      skipHydration: true, // ← don’t read storage during SSR render
      partialize: (s) => ({ items: s.items }), // don’t persist methods/flags
      onRehydrateStorage: () => (state) => {
        // called after storage is read on the client
        state?.setHasHydrated(true);
      },
    }
  )
);
