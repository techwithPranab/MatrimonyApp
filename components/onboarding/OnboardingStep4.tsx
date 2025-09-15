'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OnboardingStep4Props {
  readonly onNext: (data: EducationData) => Promise<boolean>;
  readonly onBack: () => void;
  readonly loading?: boolean;
  readonly initialData?: Partial<EducationData>;
}

export interface EducationData {
  education: string;
  educationDetails?: string;
  profession: string;
  professionDetails?: string;
  annualIncome?: number;
  currency: string;
}

const EDUCATION_LEVELS = [
  'High School', 'Diploma', 'Bachelors', 'Masters', 'PhD', 'Professional Degree', 'Other'
];

const PROFESSIONS = [
  'Engineer', 'Doctor', 'Teacher', 'Business Owner', 'Lawyer', 'IT Professional',
  'Government Service', 'Banking/Finance', 'Marketing/Sales', 'Designer', 'Artist',
  'Consultant', 'Accountant', 'Homemaker', 'Student', 'Retired', 'Other'
];

export default function OnboardingStep4({ onNext, onBack, loading, initialData }: OnboardingStep4Props) {
  const [formData, setFormData] = useState<EducationData>({
    education: initialData?.education || '',
    educationDetails: initialData?.educationDetails || '',
    profession: initialData?.profession || '',
    professionDetails: initialData?.professionDetails || '',
    annualIncome: initialData?.annualIncome || undefined,
    currency: initialData?.currency || 'USD',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.education) {
      newErrors.education = 'Education level is required';
    }
    if (!formData.profession) {
      newErrors.profession = 'Profession is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await onNext(formData);
    if (!success) {
      console.error('Failed to save step 4');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Education & Career</CardTitle>
        <p className="text-center text-gray-600">
          Tell us about your educational background and profession
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Education */}
            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                Education Level *
              </label>
              <select
                id="education"
                value={formData.education}
                onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.education ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Education</option>
                {EDUCATION_LEVELS.map(level => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {errors.education && (
                <p className="mt-1 text-sm text-red-600">{errors.education}</p>
              )}
            </div>

            {/* Profession */}
            <div>
              <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-2">
                Profession *
              </label>
              <select
                id="profession"
                value={formData.profession}
                onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.profession ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Profession</option>
                {PROFESSIONS.map(profession => (
                  <option key={profession} value={profession}>
                    {profession}
                  </option>
                ))}
              </select>
              {errors.profession && (
                <p className="mt-1 text-sm text-red-600">{errors.profession}</p>
              )}
            </div>
          </div>

          {/* Education Details */}
          <div>
            <label htmlFor="educationDetails" className="block text-sm font-medium text-gray-700 mb-2">
              Education Details (Optional)
            </label>
            <Input
              id="educationDetails"
              type="text"
              value={formData.educationDetails}
              onChange={(e) => setFormData(prev => ({ ...prev, educationDetails: e.target.value }))}
              placeholder="e.g., B.Tech Computer Science, MBA Finance"
            />
          </div>

          {/* Profession Details */}
          <div>
            <label htmlFor="professionDetails" className="block text-sm font-medium text-gray-700 mb-2">
              Job Title/Company (Optional)
            </label>
            <Input
              id="professionDetails"
              type="text"
              value={formData.professionDetails}
              onChange={(e) => setFormData(prev => ({ ...prev, professionDetails: e.target.value }))}
              placeholder="e.g., Software Engineer at Google, Consultant"
            />
          </div>

          {/* Income */}
          <div>
            <label htmlFor="annualIncome" className="block text-sm font-medium text-gray-700 mb-2">
              Annual Income (Optional)
            </label>
            <div className="flex gap-3">
              <select
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
              </select>
              <Input
                id="annualIncome"
                type="number"
                value={formData.annualIncome || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  annualIncome: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                placeholder="Enter annual income"
                className="flex-1"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              This helps in better matching and is kept private
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button 
              type="button" 
              variant="outline"
              onClick={onBack}
              disabled={loading}
            >
              Back
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="px-8"
            >
              {loading ? 'Saving...' : 'Continue'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
