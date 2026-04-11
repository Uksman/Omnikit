import React from "react";
import { StatusBar } from "expo-status-bar";
import { useThemeStore } from "../store/useThemeStore";

export function ThemeProvider({ children }) {
  const isDark = useThemeStore((state) => state.isDark);

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      {children}
    </>
  );
}

export function useAppTheme() {
  const themePreference = useThemeStore((state) => state.themePreference);
  const setThemePreference = useThemeStore((state) => state.setThemePreference);
  const isDark = useThemeStore((state) => state.isDark);
  const colors = useThemeStore((state) => state.colors);

  return {
    themePreference,
    setThemePreference,
    colorScheme: themePreference,
    setColorScheme: setThemePreference,
    isDark,
    colors,
  };
}
