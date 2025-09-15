'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, Briefcase, GraduationCap, Heart, MessageCircle, Eye } from 'lucide-react';
import { Button } from './button';

interface MobileProfileCardProps {
  readonly profile: {
    readonly id: string;
    readonly name: string;
    readonly age: number;
    readonly location: string;
    readonly profession: string;
    readonly education: string;
    readonly photos: readonly string[];
    readonly verified: boolean;
    readonly lastActive?: string;
  };
  readonly onSendInterest: (profileId: string) => void;
  readonly onStartChat: (profileId: string) => void;
  readonly onViewProfile: (profileId: string) => void;
}

export default function MobileProfileCard({ 
  profile, 
  onSendInterest, 
  onStartChat, 
  onViewProfile 
}: MobileProfileCardProps) {
  const mainPhoto = profile.photos[0] || '/placeholder-avatar.jpg';

  return (
    <div className="mobile-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-4">
      {/* Profile Photo Section */}
      <div className="relative h-80 bg-gray-100">
        <Image
          src={mainPhoto}
          alt={profile.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 320px"
        />
        
        {/* Verified Badge */}
        {profile.verified && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            ✓ Verified
          </div>
        )}
        
        {/* Photo Count Indicator */}
        {profile.photos.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
            {profile.photos.length} photos
          </div>
        )}
        
        {/* Online Status */}
        {profile.lastActive && (
          <div className="absolute top-3 left-3 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
        )}
      </div>

      {/* Profile Info Section */}
      <div className="p-4">
        {/* Name and Age */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {profile.name}, {profile.age}
          </h3>
          {profile.lastActive && (
            <span className="text-xs text-green-600 font-medium">
              {profile.lastActive}
            </span>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin size={14} className="mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{profile.location}</span>
        </div>

        {/* Profession */}
        <div className="flex items-center text-gray-600 mb-2">
          <Briefcase size={14} className="mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{profile.profession}</span>
        </div>

        {/* Education */}
        <div className="flex items-center text-gray-600 mb-4">
          <GraduationCap size={14} className="mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{profile.education}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewProfile(profile.id)}
            className="flex-1 touch-optimized text-sm"
          >
            <Eye size={16} className="mr-1" />
            View
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSendInterest(profile.id)}
            className="flex-1 touch-optimized text-sm"
          >
            <Heart size={16} className="mr-1" />
            Interest
          </Button>
          
          <Button
            size="sm"
            onClick={() => onStartChat(profile.id)}
            className="flex-1 touch-optimized text-sm"
          >
            <MessageCircle size={16} className="mr-1" />
            Chat
          </Button>
        </div>
      </div>
    </div>
  );
}
