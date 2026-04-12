import { Redirect } from "expo-router";
import { useOnboarding } from "../context/OnboardingContext";
import { useOnboardingStore } from "../store/useOnboardingStore";

export default function Index() {
  const { isCompleted } = useOnboarding();
  const _hasHydrated = useOnboardingStore((state) => state._hasHydrated);

  if (!_hasHydrated) return null;

  if (isCompleted) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/onboarding" />;
}
