import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useWaterStore = create(
  persist(
    (set, get) => ({
      intake: 0,
      goal: 2000,
      lastUpdate: new Date().toLocaleDateString(),
      history: [], // Last 7 days: { date: '4/11', amount: 1500 }
      
      checkNewDay: () => {
        const today = new Date().toLocaleDateString();
        const state = get();
        if (state.lastUpdate !== today) {
          // Save yesterday's data to history if it's not already there
          const newHistory = [
            { date: state.lastUpdate, amount: state.intake },
            ...state.history,
          ].slice(0, 7);
          
          set({
            intake: 0,
            lastUpdate: today,
            history: newHistory,
          });
        }
      },

      addIntake: (amount) => {
        get().checkNewDay();
        set((state) => ({ intake: state.intake + amount }));
      },

      resetIntake: () => set({ intake: 0 }),
      setGoal: (goal) => set({ goal }),
    }),
    {
      name: "omnikit-water-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
