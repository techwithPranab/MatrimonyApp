'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

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

interface SearchResultsProps {
  readonly profiles: ProfileResult[];
  readonly loading?: boolean;
  readonly pagination?: {
    readonly current: number;
    readonly total: number;
    readonly limit: number;
    readonly count: number;
    readonly totalProfiles: number;
  };
  readonly onPageChange?: (page: number) => void;
}

const getCompatibilityColor = (score: number) => {
  if (score >= 90) return 'bg-green-100 text-green-800';
  if (score >= 80) return 'bg-blue-100 text-blue-800';
  if (score >= 70) return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-800';
};

const formatLastActive = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Active now';
  if (diffHours < 24) return `Active ${diffHours}h ago`;
  if (diffDays < 7) return `Active ${diffDays}d ago`;
  if (diffDays < 30) return `Active ${Math.floor(diffDays / 7)}w ago`;
  return `Active ${Math.floor(diffDays / 30)}m ago`;
};

export default function SearchResults({ 
  profiles, 
  loading, 
  pagination, 
  onPageChange 
}: SearchResultsProps) {
  if (loading) {
    const loadingItems = Array.from({ length: 6 }, (_, i) => `loading-${i}`);
    
    return (
      <div className="space-y-4">
        {loadingItems.map((item) => (
          <Card key={item} className="p-6 animate-pulse">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-300 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/4" />
                <div className="h-3 bg-gray-300 rounded w-1/2" />
                <div className="h-3 bg-gray-300 rounded w-1/3" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No profiles found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search filters to see more results.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {pagination?.count || 0} of {pagination?.totalProfiles || 0} profiles
        </p>
        {pagination && pagination.totalProfiles > 0 && (
          <p className="text-sm text-gray-500">
            Page {pagination.current} of {pagination.total}
          </p>
        )}
      </div>

      {/* Profile Cards */}
      <div className="space-y-4">
        {profiles.map((profile) => (
          <Card key={profile._id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex gap-6">
              {/* Profile Image */}
              <div className="relative">
                <Avatar className="w-20 h-20">
                  {profile.photos?.[0] ? (
                    <Image 
                      src={profile.photos[0]} 
                      alt={profile.firstName}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No Photo</span>
                    </div>
                  )}
                </Avatar>
                {profile.isOnline && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Link 
                      href={`/profile/${profile._id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {profile.firstName} {profile.lastName.charAt(0)}.
                    </Link>
                    <p className="text-gray-600 text-sm">
                      {profile.age} years • {Math.round(profile.height)}cm • {profile.city}, {profile.state}
                    </p>
                  </div>
                  <Badge className={`${getCompatibilityColor(profile.compatibilityScore)} border-0`}>
                    {profile.compatibilityScore}% match
                  </Badge>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                  <p>
                    <span className="font-medium">Religion:</span> {profile.religion}
                    {profile.community && `, ${profile.community}`}
                  </p>
                  <p>
                    <span className="font-medium">Education:</span> {profile.education}
                  </p>
                  <p>
                    <span className="font-medium">Profession:</span> {profile.profession}
                  </p>
                  <p>
                    <span className="font-medium">{formatLastActive(profile.lastActiveAt)}</span>
                  </p>
                </div>

                {/* Match Reasons */}
                {profile.matchReasons && profile.matchReasons.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Why you match:</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.matchReasons.map((reason) => (
                        <Badge key={reason} variant="outline" className="text-xs">
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link 
                    href={`/profile/${profile._id}`}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Profile
                  </Link>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    Send Interest
                  </button>
                  <Link
                    href={`/chat?userId=${profile._id}`}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Message
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.total > 1 && onPageChange && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => onPageChange(pagination.current - 1)}
            disabled={pagination.current <= 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {/* Page Numbers */}
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, pagination.total) }, (_, index) => {
              const pageNum = Math.max(1, pagination.current - 2) + index;
              if (pageNum > pagination.total) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    pageNum === pagination.current
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(pagination.current + 1)}
            disabled={pagination.current >= pagination.total}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
