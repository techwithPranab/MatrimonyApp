'use client';

import React from 'react';

interface OnboardingProgressProps {
  readonly currentStep: number;
  readonly completedSteps: number[];
  readonly totalSteps: number;
  readonly onStepClick: (step: number) => void;
}

const stepTitles = [
  '', // 0 index placeholder
  'Basic Info',
  'Location', 
  'Religion',
  'Education',
  'Lifestyle',
  'Preferences',
];

export default function OnboardingProgress({ 
  currentStep, 
  completedSteps, 
  totalSteps, 
  onStepClick 
}: OnboardingProgressProps) {
  const getStepStatus = (step: number) => {
    if (completedSteps.includes(step)) {
      return 'completed';
    }
    if (step === currentStep) {
      return 'current';
    }
    if (step < currentStep) {
      return 'clickable';
    }
    return 'pending';
  };

  const getStepClasses = (step: number) => {
    const status = getStepStatus(step);
    const baseClasses = 'flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium text-sm transition-colors';
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-500 border-green-500 text-white cursor-pointer hover:bg-green-600`;
      case 'current':
        return `${baseClasses} bg-blue-600 border-blue-600 text-white`;
      case 'clickable':
        return `${baseClasses} border-gray-300 text-gray-500 cursor-pointer hover:border-gray-400 hover:text-gray-600`;
      default:
        return `${baseClasses} border-gray-300 text-gray-400`;
    }
  };

  const getConnectorClasses = (step: number) => {
    const isCompleted = completedSteps.includes(step) && completedSteps.includes(step + 1);
    const isCurrent = step < currentStep;
    
    return `flex-1 h-0.5 mx-4 ${
      isCompleted || isCurrent ? 'bg-green-500' : 'bg-gray-300'
    }`;
  };

  return (
    <div className="py-6">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1;
          const status = getStepStatus(step);
          
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                {/* Step Circle */}
                <button
                  onClick={() => status === 'clickable' || status === 'completed' ? onStepClick(step) : undefined}
                  className={getStepClasses(step)}
                  disabled={status === 'pending' || status === 'current'}
                >
                  {completedSteps.includes(step) ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  ) : (
                    step
                  )}
                </button>
                
                {/* Step Title */}
                <span className={`mt-2 text-xs font-medium ${
                  status === 'completed' || status === 'current' 
                    ? 'text-gray-900' 
                    : 'text-gray-500'
                }`}>
                  {stepTitles[step]}
                </span>
              </div>
              
              {/* Connector Line */}
              {step < totalSteps && (
                <div className={getConnectorClasses(step)} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Progress Percentage */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-600">
          Step {currentStep} of {totalSteps} - {Math.round((completedSteps.length / totalSteps) * 100)}% Complete
        </div>
      </div>
    </div>
  );
}
