import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'or', 'pa', 'as'] as const;

export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  hi: 'हिंदी',
  bn: 'বাংলা',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  mr: 'मराठी',
  gu: 'ગુજરાતી',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  or: 'ଓଡ଼ିଆ',
  pa: 'ਪੰਜਾਬੀ',
  as: 'অসমীয়া',
};

export const localeConfig: Record<Locale, { dir: 'ltr' | 'rtl'; currency: string }> = {
  en: { dir: 'ltr', currency: 'INR' },
  hi: { dir: 'ltr', currency: 'INR' },
  bn: { dir: 'ltr', currency: 'INR' },
  ta: { dir: 'ltr', currency: 'INR' },
  te: { dir: 'ltr', currency: 'INR' },
  mr: { dir: 'ltr', currency: 'INR' },
  gu: { dir: 'ltr', currency: 'INR' },
  kn: { dir: 'ltr', currency: 'INR' },
  ml: { dir: 'ltr', currency: 'INR' },
  or: { dir: 'ltr', currency: 'INR' },
  pa: { dir: 'ltr', currency: 'INR' },
  as: { dir: 'ltr', currency: 'INR' },
};

export default getRequestConfig(async (params) => {
  const locale = params.locale as Locale;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound();

  try {
    return {
      locale,
      messages: (await import(`./messages/${locale}.json`)).default
    };
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    notFound();
  }
});
