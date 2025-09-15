'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Search, 
  MessageCircle, 
  Heart, 
  User, 
  Menu, 
  X,
  Settings
} from 'lucide-react';

interface MobileNavItem {
  href: `/${string}`;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const navItems: MobileNavItem[] = [
  { href: '/dashboard' as const, label: 'Home', icon: Home },
  { href: '/search' as const, label: 'Search', icon: Search },
  { href: '/interests' as const, label: 'Interests', icon: Heart },
  { href: '/chat' as const, label: 'Chat', icon: MessageCircle },
  { href: '/profile/edit' as const, label: 'Profile', icon: User },
];

const moreNavItems: MobileNavItem[] = [
  { href: '/settings' as const, label: 'Settings', icon: Settings },
];

export default function MobileNavigation() {
  const [showMore, setShowMore] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 mobile-safe-area">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center min-w-[60px] py-2 px-1 touch-optimized tap-highlight-none ${
                  active 
                    ? 'text-primary' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={20} className="mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
          
          {/* More Button */}
          <button
            onClick={() => setShowMore(true)}
            className="flex flex-col items-center justify-center min-w-[60px] py-2 px-1 text-gray-500 hover:text-gray-700 touch-optimized tap-highlight-none"
          >
            <Menu size={20} className="mb-1" />
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* More Menu Overlay */}
      {showMore && (
        <div className="md:hidden fixed inset-0 z-50">
          <button 
            className="absolute inset-0 bg-black bg-opacity-50 w-full h-full"
            onClick={() => setShowMore(false)}
            aria-label="Close menu"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 mobile-slide-up active">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">More Options</h3>
              <button 
                onClick={() => setShowMore(false)}
                className="p-2 rounded-full hover:bg-gray-100 touch-optimized tap-highlight-none"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {moreNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMore(false)}
                    className={`flex items-center space-x-3 p-3 rounded-lg touch-optimized tap-highlight-none ${
                      active 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Additional options */}
              <div className="border-t pt-4">
                <Link
                  href="/help"
                  onClick={() => setShowMore(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 touch-optimized tap-highlight-none"
                >
                  <span className="text-lg">❓</span>
                  <span className="font-medium">Help & Support</span>
                </Link>
                
                <Link
                  href="/about"
                  onClick={() => setShowMore(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 touch-optimized tap-highlight-none"
                >
                  <span className="text-lg">ℹ️</span>
                  <span className="font-medium">About</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for bottom navigation */}
      <div className="md:hidden h-20" />
    </>
  );
}
