'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OnboardingStep6Props {
  readonly onNext: (data: PartnerPreferencesData) => Promise<boolean>;
  readonly onBack: () => void;
  readonly loading?: boolean;
  readonly initialData?: Partial<PartnerPreferencesData>;
}

export interface PartnerPreferencesData {
  ageRange: {
    min: number;
    max: number;
  };
  heightRange: {
    min: number;
    max: number;
  };
  religion: string[];
  education: string[];
  profession: string[];
  diet: string[];
  smoking: string[];
  drinking: string[];
  location: {
    preferredCities: string[];
    willingToRelocate: boolean;
  };
}

const RELIGION_OPTIONS = [
  'Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 
  'Parsi', 'Jewish', 'Bahai', 'Spiritual', 'Other', 'No Preference'
];

const EDUCATION_OPTIONS = [
  'High School', 'Diploma', 'Undergraduate', 'Graduate', 'Post Graduate',
  'PhD', 'Professional Degree', 'No Preference'
];

const PROFESSION_OPTIONS = [
  'Software Engineer', 'Doctor', 'Teacher', 'Lawyer', 'Architect',
  'Chartered Accountant', 'Business Owner', 'Government Employee',
  'Private Employee', 'Defense', 'Pilot', 'Engineer', 'Artist',
  'Other', 'No Preference'
];

const DIET_OPTIONS = [
  'Vegetarian', 'Non-Vegetarian', 'Vegan', 'Occasionally Non-Veg', 'No Preference'
];

const LIFESTYLE_OPTIONS = [
  'Never', 'Occasionally', 'Regularly', 'No Preference'
];

export default function OnboardingStep6({ onNext, onBack, loading, initialData }: OnboardingStep6Props) {
  const [formData, setFormData] = useState<PartnerPreferencesData>({
    ageRange: {
      min: initialData?.ageRange?.min || 21,
      max: initialData?.ageRange?.max || 35,
    },
    heightRange: {
      min: initialData?.heightRange?.min || 150,
      max: initialData?.heightRange?.max || 180,
    },
    religion: initialData?.religion || [],
    education: initialData?.education || [],
    profession: initialData?.profession || [],
    diet: initialData?.diet || [],
    smoking: initialData?.smoking || [],
    drinking: initialData?.drinking || [],
    location: {
      preferredCities: initialData?.location?.preferredCities || [],
      willingToRelocate: initialData?.location?.willingToRelocate ?? false,
    },
  });

  const [cityInput, setCityInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await onNext(formData);
    if (!success) {
      console.error('Failed to save step 6');
    }
  };

  const toggleReligion = (religion: string) => {
    setFormData(prev => ({
      ...prev,
      religion: prev.religion.includes(religion)
        ? prev.religion.filter(r => r !== religion)
        : [...prev.religion, religion]
    }));
  };

  const toggleEducation = (education: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.includes(education)
        ? prev.education.filter(e => e !== education)
        : [...prev.education, education]
    }));
  };

  const toggleProfession = (profession: string) => {
    setFormData(prev => ({
      ...prev,
      profession: prev.profession.includes(profession)
        ? prev.profession.filter(p => p !== profession)
        : [...prev.profession, profession]
    }));
  };

  const toggleDiet = (diet: string) => {
    setFormData(prev => ({
      ...prev,
      diet: prev.diet.includes(diet)
        ? prev.diet.filter(d => d !== diet)
        : [...prev.diet, diet]
    }));
  };

  const toggleSmoking = (smoking: string) => {
    setFormData(prev => ({
      ...prev,
      smoking: prev.smoking.includes(smoking)
        ? prev.smoking.filter(s => s !== smoking)
        : [...prev.smoking, smoking]
    }));
  };

  const toggleDrinking = (drinking: string) => {
    setFormData(prev => ({
      ...prev,
      drinking: prev.drinking.includes(drinking)
        ? prev.drinking.filter(d => d !== drinking)
        : [...prev.drinking, drinking]
    }));
  };

  const addCity = () => {
    if (cityInput.trim() && !formData.location.preferredCities.includes(cityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          preferredCities: [...prev.location.preferredCities, cityInput.trim()]
        }
      }));
      setCityInput('');
    }
  };

  const removeCity = (city: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        preferredCities: prev.location.preferredCities.filter(c => c !== city)
      }
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Partner Preferences</CardTitle>
        <p className="text-center text-gray-600">
          Help us find your perfect match by specifying your preferences
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Age and Height Ranges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-3">
                Age Range (years)
              </legend>
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <label htmlFor="minAge" className="text-sm text-gray-600">Min:</label>
                  <input
                    id="minAge"
                    type="range"
                    min="18"
                    max="70"
                    value={formData.ageRange.min}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      ageRange: { ...prev.ageRange, min: parseInt(e.target.value) }
                    }))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-8">{formData.ageRange.min}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <label htmlFor="maxAge" className="text-sm text-gray-600">Max:</label>
                  <input
                    id="maxAge"
                    type="range"
                    min="18"
                    max="70"
                    value={formData.ageRange.max}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      ageRange: { ...prev.ageRange, max: parseInt(e.target.value) }
                    }))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-8">{formData.ageRange.max}</span>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-3">
                Height Range (cm)
              </legend>
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <label htmlFor="minHeight" className="text-sm text-gray-600">Min:</label>
                  <input
                    id="minHeight"
                    type="range"
                    min="120"
                    max="220"
                    value={formData.heightRange.min}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      heightRange: { ...prev.heightRange, min: parseInt(e.target.value) }
                    }))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12">{formData.heightRange.min} cm</span>
                </div>
                <div className="flex items-center space-x-4">
                  <label htmlFor="maxHeight" className="text-sm text-gray-600">Max:</label>
                  <input
                    id="maxHeight"
                    type="range"
                    min="120"
                    max="220"
                    value={formData.heightRange.max}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      heightRange: { ...prev.heightRange, max: parseInt(e.target.value) }
                    }))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12">{formData.heightRange.max} cm</span>
                </div>
              </div>
            </fieldset>
          </div>

          {/* Religion Preferences */}
          <div>
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-3">
                Religion Preferences (Optional)
              </legend>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {RELIGION_OPTIONS.map(religion => (
                  <button
                    key={religion}
                    type="button"
                    onClick={() => toggleReligion(religion)}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                      formData.religion.includes(religion)
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {religion}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          {/* Education Preferences */}
          <div>
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-3">
                Education Preferences (Optional)
              </legend>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {EDUCATION_OPTIONS.map(education => (
                  <button
                    key={education}
                    type="button"
                    onClick={() => toggleEducation(education)}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                      formData.education.includes(education)
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {education}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          {/* Profession Preferences */}
          <div>
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-3">
                Profession Preferences (Optional)
              </legend>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {PROFESSION_OPTIONS.map(profession => (
                  <button
                    key={profession}
                    type="button"
                    onClick={() => toggleProfession(profession)}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                      formData.profession.includes(profession)
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {profession}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          {/* Lifestyle Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-3">
                  Diet Preferences
                </legend>
                <div className="space-y-2">
                  {DIET_OPTIONS.map(diet => (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => toggleDiet(diet)}
                      className={`w-full px-3 py-2 text-sm rounded-md border transition-colors text-left ${
                        formData.diet.includes(diet)
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <div>
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-3">
                  Smoking Preferences
                </legend>
                <div className="space-y-2">
                  {LIFESTYLE_OPTIONS.map(smoking => (
                    <button
                      key={smoking}
                      type="button"
                      onClick={() => toggleSmoking(smoking)}
                      className={`w-full px-3 py-2 text-sm rounded-md border transition-colors text-left ${
                        formData.smoking.includes(smoking)
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {smoking}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <div>
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-3">
                  Drinking Preferences
                </legend>
                <div className="space-y-2">
                  {LIFESTYLE_OPTIONS.map(drinking => (
                    <button
                      key={drinking}
                      type="button"
                      onClick={() => toggleDrinking(drinking)}
                      className={`w-full px-3 py-2 text-sm rounded-md border transition-colors text-left ${
                        formData.drinking.includes(drinking)
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {drinking}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>

          {/* Location Preferences */}
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-3">
              Preferred Cities (Optional)
            </legend>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Enter city name"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCity();
                  }
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={addCity}
                disabled={!cityInput.trim()}
              >
                Add
              </Button>
            </div>
            {formData.location.preferredCities.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.location.preferredCities.map(city => (
                  <span
                    key={city}
                    className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
                  >
                    {city}
                    <button
                      type="button"
                      onClick={() => removeCity(city)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.location.willingToRelocate}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, willingToRelocate: e.target.checked }
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Willing to relocate after marriage</span>
            </label>
          </fieldset>

          {/* Information Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Note about Partner Preferences
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    These preferences help us show you more compatible matches. You can always modify these later in your settings. 
                    Leaving preferences unselected means you&apos;re open to all options in that category.
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
              {loading ? 'Completing...' : 'Complete Profile'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
