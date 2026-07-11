import { create } from "zustand";
import { Stats, Course } from "./types";
import { api } from "./api";

interface StatsStore {
  stats: Stats | null;
  activeCourse: Course | null;
  fetch: () => Promise<void>;
  setActiveCourse: (course: Course) => void;
}

export const useStatsStore = create<StatsStore>((set) => ({
  stats: null,
  activeCourse: null,
  fetch: async () => {
    const [stats, courses] = await Promise.all([api.getStats(), api.getCourses()]);
    const profile = await api.getProfile();
    const active = courses.find(c => c.id === profile.active_course_id) ?? null;
    set({ stats, activeCourse: active });
  },
  setActiveCourse: (course) => set({ activeCourse: course }),
}));
