import { create } from "zustand";
import { Stats } from "./types";
import { api } from "./api";

interface StatsStore {
  stats: Stats | null;
  fetch: () => Promise<void>;
  setStats: (s: Stats) => void;
}

export const useStatsStore = create<StatsStore>((set) => ({
  stats: null,
  fetch: async () => {
    const stats = await api.getStats();
    set({ stats });
  },
  setStats: (stats) => set({ stats }),
}));
