import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useOnboardingStore = create(
  persist(
    (set) => ({
      isCompleted: false,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      completeOnboarding: () => set({ isCompleted: true }),
      resetOnboarding: () => set({ isCompleted: false }),
    }),
    {
      name: "omnikit-onboarding-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
