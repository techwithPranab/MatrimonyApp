'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { locales, localeNames, type Locale } from '@/i18n/request';

interface LanguageSwitcherProps {
  readonly className?: string;
}

export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const t = useTranslations('Settings');

  const switchLanguage = (newLocale: Locale) => {
    // Remove current locale from pathname if it exists
    const segments = pathname.split('/');
    let newPathname = pathname;
    
    // If current path starts with a locale, remove it
    if (locales.includes(segments[1] as Locale)) {
      newPathname = '/' + segments.slice(2).join('/');
    }
    
    // Add new locale prefix if it's not the default
    if (newLocale !== 'en') {
      newPathname = `/${newLocale}${newPathname}`;
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(newPathname as any);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={t('language')}
      >
        <span className="text-lg">🌐</span>
        <span>{localeNames[locale]}</span>
        <svg
          className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLanguage(loc)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-md last:rounded-b-md ${
                loc === locale ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{localeNames[loc]}</span>
                {loc === locale && (
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Currency formatter hook
export function useCurrencyFormatter() {
  const locale = useLocale();
  
  return (amount: number, currency = 'INR') => {
    return new Intl.NumberFormat(locale === 'en' ? 'en-IN' : 'hi-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
}

// Date formatter hook
export function useDateFormatter() {
  const locale = useLocale();
  
  return (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    };
    
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-IN' : locale, defaultOptions).format(dateObj);
  };
}

// Number formatter hook
export function useNumberFormatter() {
  const locale = useLocale();
  
  return (number: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(locale === 'en' ? 'en-IN' : locale, options).format(number);
  };
}
