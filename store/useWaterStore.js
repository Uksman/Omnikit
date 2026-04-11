import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useWaterStore = create(
  persist(
    (set) => ({
      intake: 0,
      goal: 2000,
      history: [], // Daily history: { day: '2024-04-11', amount: 1500 }
      
      addIntake: (amount) => set((state) => ({ intake: state.intake + amount })),
      resetIntake: () => set({ intake: 0 }),
      setGoal: (goal) => set({ goal }),
      
      // Basic reset logic for a new day could be added here or in the component
    }),
    {
      name: "omnikit-water-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
