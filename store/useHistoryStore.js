import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useHistoryStore = create(
  persist(
    (set) => ({
      history: [],
      addHistory: (item) =>
        set((state) => ({
          history: [
            { id: Date.now().toString(), timestamp: new Date().toISOString(), ...item },
            ...state.history,
          ].slice(0, 50), // Keep last 50 items
        })),
      clearHistory: () => set({ history: [] }),
      removeItem: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
    }),
    {
      name: "omnikit-history-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
