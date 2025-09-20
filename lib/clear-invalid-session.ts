'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export function useClearInvalidSession() {
  useEffect(() => {
    const handleSessionError = (event: ErrorEvent) => {
      const error = event.error;
      
      // Check if it's a JWT/NextAuth session error
      if (
        error?.name === 'JWEDecryptionFailed' ||
        error?.name === 'JWTDecryptionFailed' ||
        error?.message?.includes('decryption operation failed') ||
        error?.message?.includes('JWT') ||
        event.message?.includes('JWT') ||
        event.message?.includes('decryption operation failed')
      ) {
        console.warn('Session error detected, clearing session:', error);
        
        // Clear all NextAuth cookies
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=");
          const name = eqPos > -1 ? c.substring(0, eqPos) : c;
          const cleanName = name.trim();
          
          if (
            cleanName.includes('next-auth') ||
            cleanName.includes('__Secure-next-auth') ||
            cleanName.includes('__Host-next-auth')
          ) {
            document.cookie = `${cleanName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            document.cookie = `${cleanName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
          }
        });
        
        // Force sign out without redirect loop
        signOut({ redirect: false }).then(() => {
          window.location.href = '/sign-in?message=session-expired';
        });
      }
    };

    // Listen for global errors
    window.addEventListener('error', handleSessionError);
    
    // Listen for unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      handleSessionError({ error: event.reason } as ErrorEvent);
    };
    
    window.addEventListener('unhandledrejection', handleRejection);
    
    return () => {
      window.removeEventListener('error', handleSessionError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);
}

export function clearNextAuthCookies() {
  // Clear all NextAuth-related cookies
  const cookies = [
    'next-auth.session-token',
    'next-auth.csrf-token',
    '__Secure-next-auth.session-token',
    '__Secure-next-auth.csrf-token',
    '__Host-next-auth.csrf-token'
  ];
  
  cookies.forEach(cookieName => {
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
  });
}
