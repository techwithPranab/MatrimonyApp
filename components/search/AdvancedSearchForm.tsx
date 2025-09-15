'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface SearchFilters {
  ageRange: { min: number; max: number };
  heightRange: { min: number; max: number };
  religion: string[];
  community: string[];
  maritalStatus: string[];
  education: string[];
  profession: string[];
  location: { country: string; state: string; city: string };
  diet: string[];
  smoking: string[];
  drinking: string[];
  hasPhotos: boolean;
  isVerified: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchFormProps {
  readonly onSearch: (filters: SearchFilters) => void;
  readonly loading?: boolean;
}

const RELIGIONS = [
  'Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Jewish', 'Other'
];

const MARITAL_STATUS = [
  'Never married', 'Divorced', 'Widowed', 'Separated'
];

const EDUCATION_LEVELS = [
  'High School', 'Diploma', 'Bachelors', 'Masters', 'PhD', 'Professional'
];

const PROFESSIONS = [
  'Engineer', 'Doctor', 'Teacher', 'Business', 'Lawyer', 'IT Professional',
  'Government Service', 'Artist', 'Homemaker', 'Student', 'Other'
];

const DIET_TYPES = ['Vegetarian', 'Non-vegetarian', 'Vegan', 'Eggetarian'];

const LIFESTYLE_CHOICES = ['Never', 'Occasionally', 'Regularly'];

export default function AdvancedSearchForm({ onSearch, loading }: AdvancedSearchFormProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    ageRange: { min: 21, max: 35 },
    heightRange: { min: 150, max: 180 },
    religion: [],
    community: [],
    maritalStatus: [],
    education: [],
    profession: [],
    location: { country: '', state: '', city: '' },
    diet: [],
    smoking: [],
    drinking: [],
    hasPhotos: false,
    isVerified: false,
    sortBy: 'lastActiveAt',
    sortOrder: 'desc',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleMultiSelectChange = (field: keyof SearchFilters, value: string) => {
    const currentArray = filters[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setFilters(prev => ({ ...prev, [field]: newArray }));
  };

  const resetFilters = () => {
    setFilters({
      ageRange: { min: 21, max: 35 },
      heightRange: { min: 150, max: 180 },
      religion: [],
      community: [],
      maritalStatus: [],
      education: [],
      profession: [],
      location: { country: '', state: '', city: '' },
      diet: [],
      smoking: [],
      drinking: [],
      hasPhotos: false,
      isVerified: false,
      sortBy: 'lastActiveAt',
      sortOrder: 'desc',
    });
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Age Range */}
          <div className="space-y-2">
            <span className="text-sm font-medium">Age Range</span>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                min="18"
                max="80"
                value={filters.ageRange.min}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  ageRange: { ...prev.ageRange, min: parseInt(e.target.value) || 18 }
                }))}
                className="w-20"
                aria-label="Minimum age"
              />
              <span>to</span>
              <Input
                type="number"
                min="18"
                max="80"
                value={filters.ageRange.max}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  ageRange: { ...prev.ageRange, max: parseInt(e.target.value) || 35 }
                }))}
                className="w-20"
                aria-label="Maximum age"
              />
            </div>
          </div>

          {/* Height Range */}
          <div className="space-y-2">
            <span className="text-sm font-medium">Height (cm)</span>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                min="120"
                max="220"
                value={filters.heightRange.min}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  heightRange: { ...prev.heightRange, min: parseInt(e.target.value) || 150 }
                }))}
                className="w-20"
                aria-label="Minimum height"
              />
              <span>to</span>
              <Input
                type="number"
                min="120"
                max="220"
                value={filters.heightRange.max}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  heightRange: { ...prev.heightRange, max: parseInt(e.target.value) || 180 }
                }))}
                className="w-20"
                aria-label="Maximum height"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label htmlFor="location-input" className="text-sm font-medium">Location</label>
            <Input
              id="location-input"
              placeholder="City, State, Country"
              value={filters.location.city}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                location: { ...prev.location, city: e.target.value }
              }))}
            />
          </div>
        </div>

        {/* Religion & Marital Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-sm font-medium">Religion</span>
            <div className="flex flex-wrap gap-2">
              {RELIGIONS.map((religion) => (
                <button
                  key={religion}
                  type="button"
                  onClick={() => handleMultiSelectChange('religion', religion)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    filters.religion.includes(religion)
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {religion}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Marital Status</span>
            <div className="flex flex-wrap gap-2">
              {MARITAL_STATUS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleMultiSelectChange('maritalStatus', status)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    filters.maritalStatus.includes(status)
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Education */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Education</span>
                <div className="flex flex-wrap gap-2">
                  {EDUCATION_LEVELS.map((education) => (
                    <button
                      key={education}
                      type="button"
                      onClick={() => handleMultiSelectChange('education', education)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        filters.education.includes(education)
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {education}
                    </button>
                  ))}
                </div>
              </div>

              {/* Profession */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Profession</span>
                <div className="flex flex-wrap gap-2">
                  {PROFESSIONS.map((profession) => (
                    <button
                      key={profession}
                      type="button"
                      onClick={() => handleMultiSelectChange('profession', profession)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        filters.profession.includes(profession)
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {profession}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Lifestyle */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <span className="text-sm font-medium">Diet</span>
                <div className="flex flex-wrap gap-2">
                  {DIET_TYPES.map((diet) => (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => handleMultiSelectChange('diet', diet)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        filters.diet.includes(diet)
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Smoking</span>
                <div className="flex flex-wrap gap-2">
                  {LIFESTYLE_CHOICES.map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => handleMultiSelectChange('smoking', choice)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        filters.smoking.includes(choice)
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Drinking</span>
                <div className="flex flex-wrap gap-2">
                  {LIFESTYLE_CHOICES.map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => handleMultiSelectChange('drinking', choice)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        filters.drinking.includes(choice)
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.hasPhotos}
                  onChange={(e) => setFilters(prev => ({ ...prev, hasPhotos: e.target.checked }))}
                />
                <span className="text-sm">Has Photos</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.isVerified}
                  onChange={(e) => setFilters(prev => ({ ...prev, isVerified: e.target.checked }))}
                />
                <span className="text-sm">Verified Profiles Only</span>
              </label>
            </div>

            {/* Sort Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="sort-by" className="text-sm font-medium">Sort By</label>
                <select
                  id="sort-by"
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="lastActiveAt">Last Active</option>
                  <option value="createdAt">Recently Joined</option>
                  <option value="firstName">Name</option>
                  <option value="dateOfBirth">Age</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="sort-order" className="text-sm font-medium">Order</label>
                <select
                  id="sort-order"
                  value={filters.sortOrder}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value as 'asc' | 'desc' }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={resetFilters}
            disabled={loading}
          >
            Reset Filters
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search Profiles'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
