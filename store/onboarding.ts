import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  isFirstLaunch: boolean;
  currentStep: number;
  totalSteps: number;
  userName?: string;
  selectedInterests: string[];
  notificationsEnabled: boolean;
  completedSteps: number[];
  skippedSteps: number[];

  setUserName: (name: string) => void;
  addInterest: (interest: string) => void;
  removeInterest: (interest: string) => void;
  toggleNotifications: () => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  setIsFirstLaunch: (isFirst: boolean) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;

  markStepCompleted: (step: number) => void;
  markStepSkipped: (step: number) => void;
  resetOnboarding?: () => void;

  getProgress: () => number;
  canGoNext: () => boolean;
  canGoPrevious: () => boolean;
}

const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      selectedInterests: [],
      completedSteps: [],
      skippedSteps: [],
      isFirstLaunch: true,
      hasCompletedOnboarding: false,
      notificationsEnabled: false,
      userName: undefined,
      currentStep: 1,
      totalSteps: 4,
      setUserName: (name) => set({ userName: name.trim() }),
      setHasCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),
      setIsFirstLaunch: (isFirst) => set({ isFirstLaunch: isFirst }),
      setCurrentStep: (step) => set({ currentStep: Math.max(0, Math.min(step, get().totalSteps - 1)) }),
      toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),

      nextStep: () => {
        const { currentStep, totalSteps } = get();
        if (currentStep < totalSteps - 1) { set({ currentStep: currentStep + 1 }); }  return { currentStep, totalSteps}
      },

      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) { set({ currentStep: currentStep - 1 }); } return currentStep;
      },

      addInterest: (interest) => set((state) => ({ selectedInterests: state.selectedInterests.includes(interest) ? state.selectedInterests : [...state.selectedInterests, interest], })),
      removeInterest: (interest) => set((state) => ({ selectedInterests: state.selectedInterests.filter((i) => i !== interest),  })),
      markStepCompleted: (step) =>  set((state) => ({  completedSteps: state.completedSteps.includes(step) ? state.completedSteps : [...state.completedSteps, step],  skippedSteps: state.skippedSteps.filter((s) => s !== step), })),
      markStepSkipped: (step) => set((state) => ({ skippedSteps: state.skippedSteps.includes(step) ? state.skippedSteps : [...state.skippedSteps, step], completedSteps: state.completedSteps.filter((s) => s !== step),})),
      getProgress: () => {
        const { currentStep, totalSteps } = get();
        return ((currentStep + 1) / totalSteps) * 100;
      },

      canGoNext: () => {
        const { currentStep, totalSteps } = get();
        return currentStep < totalSteps - 1;
      },

      canGoPrevious: () => {
        const { currentStep } = get();
        return currentStep > 0;
      },

      resetOnboarding: () =>
        set({
          hasCompletedOnboarding: false,
          isFirstLaunch: true,
          currentStep: 0,
          userName: undefined,
          selectedInterests: [],
          notificationsEnabled: true,
          completedSteps: [],
          skippedSteps: [],
        }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        isFirstLaunch: state.isFirstLaunch,
        userName: state.userName,
        selectedInterests: state.selectedInterests,
        notificationsEnabled: state.notificationsEnabled,
      }),
    },
  ),
);

export default useOnboardingStore;

// Helper hook for checking status
export const useOnboardingStatus = () => {
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
  const isFirstLaunch = useOnboardingStore((state) => state.isFirstLaunch);

  return {
    hasCompletedOnboarding,
    isFirstLaunch,
    shouldShowOnboarding: isFirstLaunch && !hasCompletedOnboarding,
  };
};

// Helper hook for navigation
export const useOnboardingNavigation = () => {
  const currentStep = useOnboardingStore((state) => state.currentStep);
  const totalSteps = useOnboardingStore((state) => state.totalSteps);
  const nextStep = useOnboardingStore((state) => state.nextStep);
  const previousStep = useOnboardingStore((state) => state.previousStep);
  const canGoNext = useOnboardingStore((state) => state.canGoNext);
  const canGoPrevious = useOnboardingStore((state) => state.canGoPrevious);
  const getProgress = useOnboardingStore((state) => state.getProgress);

  return {
    currentStep,
    totalSteps,
    nextStep,
    previousStep,
    canGoNext: canGoNext(),
    canGoPrevious: canGoPrevious(),
    progress: getProgress(),
  };
};
