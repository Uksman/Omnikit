import { Stack } from "expo-router";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useAppTheme } from "../context/ThemeContext";
import { HistoryProvider } from "../context/HistoryContext";
import { OnboardingProvider, useOnboarding } from "../context/OnboardingContext";

export const unstable_settings = {
  anchor: "(tabs)",
};

function AppNavigator() {
  const { colors } = useAppTheme();
  const { isCompleted } = useOnboarding();

  if (isCompleted === null) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen 
        name="onboarding/index" 
        options={{ 
          redirect: isCompleted 
        }} 
      />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="privacy"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="tools/tip-calculator"
      />
      <Stack.Screen name="tools/qr-generator" />
      <Stack.Screen name="tools/qr-scanner" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <OnboardingProvider>
          <HistoryProvider>
            <AppNavigator />
          </HistoryProvider>
        </OnboardingProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
