import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/sanity.types";

export type CartProduct = {
  _id: string;
  slug?: string; // canonical string for /products/[slug]
  name?: string;
  mainImage?: Product["mainImage"]; // keep the Sanity image shape
};

export interface BasketItem {
  product: CartProduct;
  quantity: number;
  unitPrice: number; // always use this for totals
  variantKey?: string; // unique key for color x size variant
  sizeId?: string;
  colorId?: string;
  sizeLabel?: string; // for display, no re-fetch needed
  colorName?: string; // for display
}

interface BasketState {
  items: BasketItem[];

  addItem: (item: Omit<BasketItem, "quantity">) => void;
  removeItem: (productId: string, variantKey?: string) => void;
  clearBasket: () => void;

  increment: (productId: string, variantKey?: string) => void;
  decrement: (productId: string, variantKey?: string) => void;

  getTotalPrice: () => number;
  getItemCount: (productId: string, variantKey?: string) => number;
  getGroupedItems: () => BasketItem[];
  totalItems: () => number;
}

const byLine = (a: BasketItem, productId: string, variantKey?: string) =>
  a.product._id === productId && a.variantKey === (variantKey ?? a.variantKey);

const useBasketStore = create<BasketState>()(
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

      clearBasket: () => set({ items: [] }),

      increment: (productId, variantKey) =>
        set((state) => ({
          items: state.items.map((i) =>
            byLine(i, productId, variantKey)
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        })),

      decrement: (productId, variantKey) =>
        set((state) => {
          const items = state.items
            .map((i) =>
              byLine(i, productId, variantKey)
                ? { ...i, quantity: i.quantity - 1 }
                : i
            )
            .filter((i) => i.quantity > 0);
          return { items };
        }),

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.unitPrice * item.quantity,
          0
        ),

      getItemCount: (productId, variantKey) =>
        get().items.find((i) => byLine(i, productId, variantKey))?.quantity ||
        0,

      getGroupedItems: () => get().items,

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "basket-storage" }
  )
);

export default useBasketStore;
