'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';

interface SwipeableCardProps {
  readonly children: React.ReactNode;
  readonly onSwipeLeft?: () => void;
  readonly onSwipeRight?: () => void;
  readonly onTap?: () => void;
  readonly className?: string;
}

export function SwipeableCard({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  onTap,
  className = '' 
}: SwipeableCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const startPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    currentPos.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    currentPos.current = { x: touch.clientX, y: touch.clientY };
    
    const deltaX = currentPos.current.x - startPos.current.x;
    const deltaY = currentPos.current.y - startPos.current.y;

    // Only allow horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
      setPosition({ x: deltaX, y: 0 });
      setOpacity(1 - Math.abs(deltaX) / 300);
    }
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;

    const deltaX = currentPos.current.x - startPos.current.x;
    const deltaY = currentPos.current.y - startPos.current.y;
    const swipeThreshold = 100;

    // Check if it's a swipe or tap
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      // It's a tap
      onTap?.();
    } else if (Math.abs(deltaX) > swipeThreshold) {
      // It's a swipe
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }

    // Reset position
    setPosition({ x: 0, y: 0 });
    setOpacity(1);
    setIsDragging(false);
  }, [isDragging, onSwipeLeft, onSwipeRight, onTap]);

  return (
    <div
      className={`touch-pan-x select-none ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateX(${position.x}px) translateY(${position.y}px)`,
        opacity,
        transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease'
      }}
    >
      {children}
    </div>
  );
}

interface MobileSearchBarProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onSearch: () => void;
  readonly onFilterToggle: () => void;
  readonly placeholder?: string;
  readonly showFilter?: boolean;
}

export function MobileSearchBar({ 
  value, 
  onChange, 
  onSearch, 
  onFilterToggle,
  placeholder = 'Search profiles...',
  showFilter = true
}: MobileSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-20">
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <Search 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            placeholder={placeholder}
            className="pl-10 pr-4 h-11 text-base border-2 focus:border-blue-500 focus:ring-0 rounded-full"
          />
          {value && (
            <button
              onClick={() => onChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 touch-optimized p-1"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        {showFilter && (
          <Button
            variant="outline"
            size="sm"
            onClick={onFilterToggle}
            className="h-11 w-11 p-0 rounded-full border-2"
          >
            <Filter size={20} />
          </Button>
        )}
        
        {(isFocused || value) && (
          <Button
            size="sm"
            onClick={onSearch}
            className="h-11 px-4 text-sm font-medium"
          >
            Search
          </Button>
        )}
      </div>
    </div>
  );
}

interface SwipeableProfileListProps {
  readonly profiles: Array<{
    readonly id: string;
    readonly name: string;
    readonly age: number;
    readonly location: string;
    readonly photos: readonly string[];
  }>;
  readonly onLike: (profileId: string) => void;
  readonly onReject: (profileId: string) => void;
  readonly onViewProfile: (profileId: string) => void;
  readonly loading?: boolean;
}

export function SwipeableProfileList({ 
  profiles, 
  onLike, 
  onReject, 
  onViewProfile,
  loading = false
}: SwipeableProfileListProps) {
  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-96"></div>
        ))}
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-4">💝</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No profiles found</h3>
        <p className="text-gray-600">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {profiles.map((profile) => (
        <SwipeableCard
          key={profile.id}
          onSwipeLeft={() => onReject(profile.id)}
          onSwipeRight={() => onLike(profile.id)}
          onTap={() => onViewProfile(profile.id)}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                {profile.photos[0] && (
                  <img
                    src={profile.photos[0]}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {profile.name}, {profile.age}
                </h3>
                <p className="text-gray-600 text-sm">{profile.location}</p>
              </div>
            </div>
          </div>
          
          {/* Swipe Instructions */}
          <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-400">
            ← Reject • Tap to view • Like →
          </div>
        </SwipeableCard>
      ))}
    </div>
  );
}

// Touch gesture utilities
export const touchGestures = {
  // Detect swipe direction
  detectSwipe: (
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number,
    threshold = 50
  ): 'left' | 'right' | 'up' | 'down' | null => {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > threshold) {
        return deltaX > 0 ? 'right' : 'left';
      }
    } else if (Math.abs(deltaY) > threshold) {
      // Vertical swipe
      return deltaY > 0 ? 'down' : 'up';
    }
    
    return null;
  },
  
  // Detect if touch is a tap
  isTap: (
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number,
    threshold = 10
  ): boolean => {
    const deltaX = Math.abs(endX - startX);
    const deltaY = Math.abs(endY - startY);
    return deltaX < threshold && deltaY < threshold;
  },
  
  // Calculate touch distance
  getTouchDistance: (
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number
  ): number => {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }
};
