import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { theme } from "../constants/theme";

const calculateIsDark = (preference) => {
  if (preference === "system") {
    return Appearance.getColorScheme() === "dark";
  }
  return preference === "dark";
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      themePreference: "system",
      isDark: calculateIsDark("system"),
      colors: calculateIsDark("system") ? theme.dark : theme.light,
      
      setThemePreference: (preference) => {
        const isDark = calculateIsDark(preference);
        set({ 
          themePreference: preference,
          isDark,
          colors: isDark ? theme.dark : theme.light
        });
      },

      refreshTheme: () => {
        const { themePreference } = get();
        const isDark = calculateIsDark(themePreference);
        set({ 
          isDark,
          colors: isDark ? theme.dark : theme.light
        });
      }
    }),
    {
      name: "omnikit-theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ themePreference: state.themePreference }),
      onRehydrateStorage: () => (state) => {
        if (state) state.refreshTheme();
      }
    }
  )
);

// Listen to system theme changes
Appearance.addChangeListener(() => {
  const { themePreference, refreshTheme } = useThemeStore.getState();
  if (themePreference === "system") {
    refreshTheme();
  }
});
