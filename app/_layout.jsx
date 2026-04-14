import { Stack, ErrorBoundary } from "expo-router";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useAppTheme } from "../context/ThemeContext";
import { HistoryProvider } from "../context/HistoryContext";
import { OnboardingProvider } from "../context/OnboardingContext";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { ToastProvider } from "../context/ToastContext";
import { Toast } from "../components/Toast";

// Error Boundary for the whole app
export { ErrorBoundary };

function AppNavigator() {
  const { colors } = useAppTheme();
  const _hasHydrated = useOnboardingStore((state) => state._hasHydrated);

  if (!_hasHydrated) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen 
        name="onboarding/index" 
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
      <Stack.Screen name="tools/task-manager" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ToastProvider>
          <OnboardingProvider>
            <HistoryProvider>
              <AppNavigator />
              <Toast />
            </HistoryProvider>
          </OnboardingProvider>
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
