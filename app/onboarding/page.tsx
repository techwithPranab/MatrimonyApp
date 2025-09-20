'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import OnboardingStep1 from '@/components/onboarding/OnboardingStep1';
import OnboardingStep2 from '@/components/onboarding/OnboardingStep2';
import OnboardingStep3 from '@/components/onboarding/OnboardingStep3';
import OnboardingStep4 from '@/components/onboarding/OnboardingStep4';
import OnboardingStep5 from '@/components/onboarding/OnboardingStep5';
import OnboardingStep6 from '@/components/onboarding/OnboardingStep6';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress';
import { Card } from '@/components/ui/card';

interface OnboardingStatus {
  currentStep: number;
  completedSteps: number[];
  totalSteps: number;
  isComplete: boolean;
  profile?: Record<string, unknown>;
}

export default function OnboardingPage() {
  const { status } = useSession();
  const router = useRouter();
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchOnboardingStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/onboarding');
      if (response.ok) {
        const data = await response.json();
        setOnboardingStatus(data);
        
        // If onboarding is complete, redirect to dashboard
        if (data.isComplete) {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error fetching onboarding status:', error);
    } finally {
      setLoading(false);
    }
  }, [router, setOnboardingStatus, setLoading]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
      return;
    }

    if (status === 'authenticated') {
      fetchOnboardingStatus();
    }
  }, [status, router, fetchOnboardingStatus]);

  const saveStep = async (step: number, data: unknown) => {
    setSaving(true);
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ step, data }),
      });

      if (response.ok) {
        await fetchOnboardingStatus();
        return true;
      } else {
        console.error('Failed to save step');
        return false;
      }
    } catch (error) {
      console.error('Error saving step:', error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const goToStep = (step: number) => {
    if (onboardingStatus && step <= onboardingStatus.currentStep) {
      setOnboardingStatus({
        ...onboardingStatus,
        currentStep: step,
      });
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!onboardingStatus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <p className="text-center text-gray-600">Something went wrong. Please try again.</p>
        </Card>
      </div>
    );
  }

  const renderCurrentStep = () => {
    switch (onboardingStatus.currentStep) {
      case 1:
        return (
          <OnboardingStep1
            onNext={(data) => saveStep(1, data)}
            loading={saving}
            initialData={onboardingStatus.profile}
          />
        );
      case 2:
        return (
          <OnboardingStep2
            onNext={(data) => saveStep(2, data)}
            onBack={() => goToStep(1)}
            loading={saving}
            initialData={onboardingStatus.profile}
          />
        );
      case 3:
        return (
          <OnboardingStep3
            onNext={(data) => saveStep(3, data)}
            onBack={() => goToStep(2)}
            loading={saving}
            initialData={onboardingStatus.profile}
          />
        );
      case 4:
        return (
          <OnboardingStep4
            onNext={(data) => saveStep(4, data)}
            onBack={() => goToStep(3)}
            loading={saving}
            initialData={onboardingStatus.profile}
          />
        );
      case 5:
        return (
          <OnboardingStep5
            onNext={(data) => saveStep(5, data)}
            onBack={() => goToStep(4)}
            loading={saving}
            initialData={onboardingStatus.profile}
          />
        );
      case 6:
        return (
          <OnboardingStep6
            onNext={(data) => saveStep(6, data)}
            onBack={() => goToStep(5)}
            loading={saving}
            initialData={onboardingStatus.profile}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Complete Your Profile
              </h1>
              <p className="text-lg text-gray-600">
                Let&apos;s help you find your perfect match by setting up your profile
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <OnboardingProgress
            currentStep={onboardingStatus.currentStep}
            completedSteps={onboardingStatus.completedSteps}
            totalSteps={onboardingStatus.totalSteps}
            onStepClick={goToStep}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}
