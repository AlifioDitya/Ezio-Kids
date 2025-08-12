// store/wishlist-ui.ts
"use client";

import { create } from "zustand";

type UI = {
  open: boolean;
  setOpen: (v: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggle: () => void;
};

const useWishlistUi = create<UI>((set) => ({
  open: false,
  setOpen: (v) => set({ open: v }),
  openDrawer: () => set({ open: true }),
  closeDrawer: () => set({ open: false }),
  toggle: () => set((s) => ({ open: !s.open })),
}));

export default useWishlistUi;
