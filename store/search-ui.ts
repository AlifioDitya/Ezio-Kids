// store/search-ui.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  open: boolean;
  recent: string[];
  setOpen: (v: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  addRecent: (q: string) => void;
  clearRecent: () => void;
};

const useSearchUi = create<State>()(
  persist(
    (set, get) => ({
      open: false,
      recent: [],
      setOpen: (v) => set({ open: v }),
      openDrawer: () => set({ open: true }),
      closeDrawer: () => set({ open: false }),
      addRecent: (q) => {
        const v = q.trim();
        if (!v) return;
        const dedup = [v, ...get().recent.filter((x) => x !== v)].slice(0, 8);
        set({ recent: dedup });
      },
      clearRecent: () => set({ recent: [] }),
    }),
    { name: "search-ui" }
  )
);

export default useSearchUi;
