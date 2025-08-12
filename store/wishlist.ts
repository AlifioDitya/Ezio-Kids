import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/sanity.types";

export type WishlistProduct = {
  _id: string;
  slug?: string; // canonical string for /products/[slug]
  name?: string;
  mainImage?: Product["mainImage"]; // keep the Sanity image shape
};

export interface WishlistItem {
  product: WishlistProduct;
  quantity: number;
  unitPrice: number; // always use this for totals
  variantKey?: string; // unique key for color x size variant
  sizeId?: string;
  colorId?: string;
  sizeLabel?: string; // for display, no re-fetch needed
  colorName?: string; // for display
}

interface WishlistState {
  items: WishlistItem[];

  addItem: (item: Omit<WishlistItem, "quantity">) => void;
  removeItem: (productId: string, variantKey?: string) => void;
  clearWishlist: () => void;

  totalItems: () => number;
}

const byLine = (a: WishlistItem, productId: string, variantKey?: string) =>
  a.product._id === productId && a.variantKey === (variantKey ?? a.variantKey);

const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const idx = state.items.findIndex((i) =>
            byLine(i, item.product._id, item.variantKey)
          );
          if (idx >= 0) {
            const next = [...state.items];
            next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
            return { items: next };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (productId, variantKey) =>
        set((state) => ({
          items: state.items.filter((i) => !byLine(i, productId, variantKey)),
        })),

      clearWishlist: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "Wishlist-storage" }
  )
);

export default useWishlistStore;
