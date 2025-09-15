'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface OnboardingStep5Props {
  readonly onNext: (data: LifestyleData) => Promise<boolean>;
  readonly onBack: () => void;
  readonly loading?: boolean;
  readonly initialData?: Partial<LifestyleData>;
}

export interface LifestyleData {
  diet: 'vegetarian' | 'non_vegetarian' | 'vegan' | 'occasionally_non_veg';
  smoking: 'never' | 'occasionally' | 'regularly';
  drinking: 'never' | 'occasionally' | 'regularly';
  aboutMe: string;
  interests: string[];
}

const DIET_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'non_vegetarian', label: 'Non-Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'occasionally_non_veg', label: 'Occasionally Non-Veg' },
];

const LIFESTYLE_OPTIONS = [
  { value: 'never', label: 'Never' },
  { value: 'occasionally', label: 'Occasionally' },
  { value: 'regularly', label: 'Regularly' },
];

const INTERESTS_OPTIONS = [
  'Reading', 'Movies', 'Music', 'Cooking', 'Traveling', 'Photography',
  'Sports', 'Fitness', 'Yoga', 'Dancing', 'Singing', 'Art', 'Writing',
  'Gaming', 'Technology', 'Fashion', 'Nature', 'Pets', 'Volunteering',
  'Meditation', 'Adventure', 'History', 'Science', 'Politics'
];

export default function OnboardingStep5({ onNext, onBack, loading, initialData }: OnboardingStep5Props) {
  const [formData, setFormData] = useState<LifestyleData>({
    diet: initialData?.diet || 'vegetarian',
    smoking: initialData?.smoking || 'never',
    drinking: initialData?.drinking || 'never',
    aboutMe: initialData?.aboutMe || '',
    interests: initialData?.interests || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.aboutMe.trim()) {
      newErrors.aboutMe = 'About me section is required';
    } else if (formData.aboutMe.trim().length < 50) {
      newErrors.aboutMe = 'Please write at least 50 characters about yourself';
    }

    if (formData.interests.length === 0) {
      newErrors.interests = 'Please select at least one interest';
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
      console.error('Failed to save step 5');
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Lifestyle & Interests</CardTitle>
        <p className="text-center text-gray-600">
          Tell us about your lifestyle preferences and interests
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Lifestyle Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="diet" className="block text-sm font-medium text-gray-700 mb-2">
                Diet Preference *
              </label>
              <select
                id="diet"
                value={formData.diet}
                onChange={(e) => setFormData(prev => ({ ...prev, diet: e.target.value as LifestyleData['diet'] }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {DIET_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="smoking" className="block text-sm font-medium text-gray-700 mb-2">
                Smoking *
              </label>
              <select
                id="smoking"
                value={formData.smoking}
                onChange={(e) => setFormData(prev => ({ ...prev, smoking: e.target.value as LifestyleData['smoking'] }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {LIFESTYLE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="drinking" className="block text-sm font-medium text-gray-700 mb-2">
                Drinking *
              </label>
              <select
                id="drinking"
                value={formData.drinking}
                onChange={(e) => setFormData(prev => ({ ...prev, drinking: e.target.value as LifestyleData['drinking'] }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {LIFESTYLE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* About Me */}
          <div>
            <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-700 mb-2">
              About Me *
            </label>
            <Textarea
              id="aboutMe"
              value={formData.aboutMe}
              onChange={(e) => setFormData(prev => ({ ...prev, aboutMe: e.target.value }))}
              placeholder="Write a brief introduction about yourself, your personality, hobbies, and what you're looking for in a partner..."
              rows={6}
              className={errors.aboutMe ? 'border-red-500' : ''}
            />
            <div className="flex justify-between mt-1">
              {errors.aboutMe && (
                <p className="text-sm text-red-600">{errors.aboutMe}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">
                {formData.aboutMe.length} characters (minimum 50)
              </p>
            </div>
          </div>

          {/* Interests */}
          <div>
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-3">
                Interests & Hobbies * (Select at least one)
              </legend>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {INTERESTS_OPTIONS.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                      formData.interests.includes(interest)
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              {errors.interests && (
                <p className="mt-2 text-sm text-red-600">{errors.interests}</p>
              )}
            </fieldset>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Profile Tips
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Be authentic and honest in your description</li>
                    <li>Mention your hobbies and what makes you unique</li>
                    <li>Share what you&apos;re looking for in a partner</li>
                    <li>Keep it positive and engaging</li>
                  </ul>
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
