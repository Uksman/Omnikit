import { useOnboardingStore } from "../store/useOnboardingStore";

export function OnboardingProvider({ children }) {
  return <>{children}</>;
}

export function useOnboarding() {
  const { isCompleted, completeOnboarding, resetOnboarding } = useOnboardingStore();
  return { isCompleted, completeOnboarding, resetOnboarding };
}
