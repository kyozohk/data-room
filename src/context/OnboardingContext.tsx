'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  OnboardingProgress, 
  OnboardingStep, 
  saveOnboardingProgress, 
  storeOnboardingProgressInUser,
  getOnboardingProgress,
  getNextOnboardingStep,
  isOnboardingComplete
} from '@/lib/onboarding';
import { getUserProfile } from '../lib/auth';

interface OnboardingContextType {
  progress: OnboardingProgress | null;
  currentStep: OnboardingStep | null;
  isLoading: boolean;
  isComplete: boolean;
  saveStepData: (step: OnboardingStep, data: any, markCompleted?: boolean) => Promise<void>;
  goToStep: (step: OnboardingStep) => void;
  refreshProgress: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [currentStep, setCurrentStep] = useState<OnboardingStep | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  // Load onboarding progress when user is available
  const refreshProgress = async () => {
    if (!user) {
      setProgress(null);
      setCurrentStep(null);
      setIsComplete(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const userProfile = await getUserProfile(user.uid);
      
      if (userProfile) {
        const onboardingProgress = await getOnboardingProgress(user.uid);
        
        if (onboardingProgress) {
          setProgress(onboardingProgress);
          const isComplete = isOnboardingComplete(onboardingProgress);
          
          setIsComplete(isComplete);
          
          if (isComplete) {
            setCurrentStep(null);
          } else {
            const nextStep = getNextOnboardingStep(onboardingProgress);
            setCurrentStep(nextStep || onboardingProgress.currentStep);
          }
        } else {
          // No progress found, start from auth step
          setCurrentStep('auth');
          setIsComplete(false);
        }
      }
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProgress();
  }, [user]);

  // Save step data and update progress
  const saveStepData = async (step: OnboardingStep, data: any, markCompleted: boolean = false) => {
    if (!user) return;

    try {
      const userProfile = await getUserProfile(user.uid);
      if (userProfile) {
        await storeOnboardingProgressInUser(user.uid, step, data, markCompleted);
        await refreshProgress(); // Refresh to get updated state
      }
    } catch (error) {
      console.error('Error saving step data:', error);
      throw error;
    }
  };

  // Navigate to specific step
  const goToStep = (step: OnboardingStep) => {
    setCurrentStep(step);
  };

  const value: OnboardingContextType = {
    progress,
    currentStep,
    isLoading,
    isComplete,
    saveStepData,
    goToStep,
    refreshProgress,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export default OnboardingProvider;
