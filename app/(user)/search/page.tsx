"use client";

import { useState, useCallback } from "react";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { WithPullToRefresh } from "@/components/ui/pull-to-refresh";
import { MobileSearchBar, SwipeableProfileList } from "@/components/ui/mobile-touch";
import AdvancedSearchForm from "@/components/search/AdvancedSearchForm";
import SearchResults from "@/components/search/SearchResults";
import { useActionTracking, useMatrimonyTracking } from "@/lib/analytics/hooks";

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

interface ProfileResult {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  height: number;
  religion: string;
  community: string;
  education: string;
  profession: string;
  city: string;
  state: string;
  country: string;
  photos: string[];
  compatibilityScore: number;
  matchReasons: string[];
  lastActiveAt: Date;
  isOnline?: boolean;
}

interface SearchResponse {
  profiles: ProfileResult[];
  pagination: {
    current: number;
    total: number;
    limit: number;
    count: number;
    totalProfiles: number;
  };
}

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');

  // Analytics hooks
  const { trackSearch } = useActionTracking();
  const { trackMatchmaking, trackProfileAction } = useMatrimonyTracking();

  const handleSearch = async (filters?: SearchFilters, page = 1) => {
    setLoading(true);
    
    // Track search analytics
    const searchFilters = filters || {
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
      sortOrder: 'desc' as const,
    };
    
    trackSearch(searchQuery.trim(), {
      filters: searchFilters,
      page,
      isMobile,
    });
    
    try {
      const searchData = {
        ...searchFilters,
        page,
        limit: 20,
        searchQuery: searchQuery.trim(),
      };

      const response = await fetch("/api/profiles/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchData),
      });

      if (response.ok) {
        const data: SearchResponse = await response.json();
        setSearchResults(data);
        
        // Track search results
        trackMatchmaking('matches_viewed', {
          resultCount: data.profiles.length,
          totalResults: data.pagination.totalProfiles,
          hasQuery: searchQuery.trim().length > 0,
          filtersUsed: Object.keys(searchFilters).filter(key => {
            const value = searchFilters[key as keyof SearchFilters];
            return Array.isArray(value) ? value.length > 0 : value !== '' && value !== false;
          }).length,
        });
      } else {
        console.error("Search failed:", response.statusText);
        setSearchResults({ profiles: [], pagination: { current: 1, total: 0, limit: 20, count: 0, totalProfiles: 0 } });
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults({ profiles: [], pagination: { current: 1, total: 0, limit: 20, count: 0, totalProfiles: 0 } });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate refresh
    if (searchResults) {
      handleSearch();
    }
  }, [searchResults]);

  const handleLike = useCallback(async (profileId: string) => {
    try {
      await fetch('/api/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, type: 'like' }),
      });
      
      // Track profile interaction
      trackProfileAction('interest_sent', profileId);
      trackMatchmaking('match_saved', { profileId, interaction: 'like' });
      
    } catch (error) {
      console.error('Failed to send interest:', error);
    }
  }, [trackProfileAction, trackMatchmaking]);

  const handleReject = useCallback(async (profileId: string) => {
    try {
      await fetch('/api/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, type: 'reject' }),
      });
      
      // Track rejection
      trackMatchmaking('match_dismissed', { profileId, interaction: 'reject' });
      
      // Remove from current results
      setSearchResults(prev => prev ? {
        ...prev,
        profiles: prev.profiles.filter(p => p._id !== profileId)
      } : null);
    } catch (error) {
      console.error('Failed to reject profile:', error);
    }
  }, [trackMatchmaking]);

  const handleViewProfile = useCallback((profileId: string) => {
    // Track profile view
    trackProfileAction('view', profileId);
    window.location.href = `/profile/${profileId}`;
  }, [trackProfileAction]);

  const handlePageChange = (page: number) => {
    if (searchResults) {
      // Re-run last search with new page
      const lastFilters: SearchFilters = {
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
      };
      handleSearch(lastFilters, page);
    }
  };

  // Mobile-optimized profiles for swipeable list
  const mobileProfiles = searchResults?.profiles.map(profile => ({
    id: profile._id,
    name: `${profile.firstName} ${profile.lastName}`,
    age: profile.age,
    location: `${profile.city}, ${profile.state}`,
    photos: profile.photos,
  })) || [];

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={() => handleSearch()}
          onFilterToggle={() => setShowFilters(!showFilters)}
          placeholder="Search by name, location..."
        />

        {showFilters && (
          <div className="bg-white border-b border-gray-200 p-4">
            <AdvancedSearchForm onSearch={handleSearch} loading={loading} />
          </div>
        )}

        <WithPullToRefresh onRefresh={handleRefresh} enabled={!!searchResults}>
          <SwipeableProfileList
            profiles={mobileProfiles}
            onLike={handleLike}
            onReject={handleReject}
            onViewProfile={handleViewProfile}
            loading={loading}
          />
        </WithPullToRefresh>

        {!searchResults && !loading && (
          <div className="flex flex-col items-center justify-center p-8 text-center mt-20">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Your Perfect Match</h3>
            <p className="text-gray-600 mb-4">Search by name or use filters to discover compatible profiles</p>
            <div className="bg-blue-50 rounded-lg p-4 text-left max-w-sm">
              <h4 className="font-medium text-blue-900 mb-2">Search Tips:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Swipe right to like profiles</li>
                <li>• Swipe left to pass</li>
                <li>• Tap to view full profile</li>
                <li>• Pull down to refresh</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop version (existing code)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Perfect Match</h1>
              <p className="text-xl text-gray-600">
                Use our advanced search to discover compatible profiles
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Search Form */}
          <AdvancedSearchForm onSearch={handleSearch} loading={loading} />

          {/* Search Results */}
          {(searchResults || loading) && (
            <div>
              <SearchResults
                profiles={searchResults?.profiles || []}
                loading={loading}
                pagination={searchResults?.pagination}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {/* Initial State */}
          {!searchResults && !loading && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Ready to Find Your Match?
                </h3>
                <p className="text-gray-600 mb-6">
                  Use the search form above to discover compatible profiles based on your preferences.
                  Our advanced matching algorithm will help you find the most suitable partners.
                </p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Search Tips:</h4>
                  <ul className="text-sm text-blue-800 space-y-1 text-left">
                    <li>• Start with basic filters like age and location</li>
                    <li>• Use advanced filters for more specific preferences</li>
                    <li>• Our compatibility scores help identify the best matches</li>
                    <li>• Filter by verified profiles for added authenticity</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
