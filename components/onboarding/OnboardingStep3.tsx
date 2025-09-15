'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OnboardingStep3Props {
  readonly onNext: (data: ReligionData) => Promise<boolean>;
  readonly onBack: () => void;
  readonly loading?: boolean;
  readonly initialData?: Partial<ReligionData>;
}

export interface ReligionData {
  religion: string;
  community: string;
  subCommunity?: string;
}

const RELIGIONS = [
  'Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Jewish', 
  'Parsi', 'No Religion', 'Other'
];

const COMMUNITIES_BY_RELIGION: Record<string, string[]> = {
  'Hindu': [
    'Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Kayastha', 'Bania', 
    'Maratha', 'Reddy', 'Nair', 'Menon', 'Iyer', 'Iyengar', 'Other'
  ],
  'Muslim': [
    'Sunni', 'Shia', 'Bohra', 'Ismaili', 'Ahmadiyya', 'Other'
  ],
  'Christian': [
    'Catholic', 'Protestant', 'Orthodox', 'Pentecostal', 'Anglican', 
    'Syrian Christian', 'Other'
  ],
  'Sikh': [
    'Jat Sikh', 'Khatri', 'Arora', 'Ramgarhia', 'Saini', 'Other'
  ],
  'Buddhist': [
    'Theravada', 'Mahayana', 'Vajrayana', 'Zen', 'Other'
  ],
  'Jain': [
    'Digambar', 'Svetambar', 'Other'
  ],
};

export default function OnboardingStep3({ onNext, onBack, loading, initialData }: OnboardingStep3Props) {
  const [formData, setFormData] = useState<ReligionData>({
    religion: initialData?.religion || '',
    community: initialData?.community || '',
    subCommunity: initialData?.subCommunity || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.religion) {
      newErrors.religion = 'Religion is required';
    }
    if (!formData.community) {
      newErrors.community = 'Community is required';
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
      console.error('Failed to save step 3');
    }
  };

  const handleReligionChange = (religion: string) => {
    setFormData({
      religion,
      community: '',
      subCommunity: '',
    });
  };

  const getCommunitiesForReligion = () => {
    return COMMUNITIES_BY_RELIGION[formData.religion] || [];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Religion & Community</CardTitle>
        <p className="text-center text-gray-600">
          Help us understand your religious and cultural background
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Religion */}
          <div>
            <label htmlFor="religion" className="block text-sm font-medium text-gray-700 mb-2">
              Religion *
            </label>
            <select
              id="religion"
              value={formData.religion}
              onChange={(e) => handleReligionChange(e.target.value)}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.religion ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Religion</option>
              {RELIGIONS.map(religion => (
                <option key={religion} value={religion}>
                  {religion}
                </option>
              ))}
            </select>
            {errors.religion && (
              <p className="mt-1 text-sm text-red-600">{errors.religion}</p>
            )}
          </div>

          {/* Community */}
          <div>
            <label htmlFor="community" className="block text-sm font-medium text-gray-700 mb-2">
              Community/Caste *
            </label>
            {getCommunitiesForReligion().length > 0 ? (
              <select
                id="community"
                value={formData.community}
                onChange={(e) => setFormData(prev => ({ ...prev, community: e.target.value }))}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.community ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={!formData.religion}
              >
                <option value="">Select Community</option>
                {getCommunitiesForReligion().map(community => (
                  <option key={community} value={community}>
                    {community}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id="community"
                type="text"
                value={formData.community}
                onChange={(e) => setFormData(prev => ({ ...prev, community: e.target.value }))}
                placeholder="Enter your community/caste"
                className={errors.community ? 'border-red-500' : ''}
                disabled={!formData.religion}
              />
            )}
            {errors.community && (
              <p className="mt-1 text-sm text-red-600">{errors.community}</p>
            )}
          </div>

          {/* Sub-Community (Optional) */}
          <div>
            <label htmlFor="subCommunity" className="block text-sm font-medium text-gray-700 mb-2">
              Sub-Community (Optional)
            </label>
            <Input
              id="subCommunity"
              type="text"
              value={formData.subCommunity}
              onChange={(e) => setFormData(prev => ({ ...prev, subCommunity: e.target.value }))}
              placeholder="Enter sub-community if applicable"
            />
            <p className="mt-1 text-sm text-gray-500">
              For example: Agarwal, Gupta, Sharma, etc.
            </p>
          </div>

          {/* Privacy Notice */}
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Your Privacy is Protected
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    This information is used for matching purposes only. You can control 
                    who sees this information in your privacy settings later.
                  </p>
                </div>
              </div>
            </div>
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
