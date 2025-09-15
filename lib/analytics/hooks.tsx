'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { performanceMonitor } from './performance';
import { userAnalytics } from './user-analytics';

// Hook for tracking page views
export function usePageTracking() {
  const router = useRouter();
  const lastPathname = useRef<string | null>(null);

  useEffect(() => {
    const handleRouteChange = () => {
      const currentPath = window.location.pathname;
      if (currentPath !== lastPathname.current) {
        const pageName = document.title || currentPath;
        userAnalytics.trackPageView(pageName, window.location.href);
        lastPathname.current = currentPath;
      }
    };

    // Track initial page load
    handleRouteChange();

    // Track route changes
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
}

// Hook for tracking user actions
export function useActionTracking() {
  const trackAction = useCallback((
    actionType: string, 
    metadata: Record<string, unknown> = {},
    elementId?: string
  ) => {
    userAnalytics.trackAction(actionType, metadata, elementId);
  }, []);

  const trackClick = useCallback((elementId: string, metadata: Record<string, unknown> = {}) => {
    trackAction('click', metadata, elementId);
  }, [trackAction]);

  const trackFormSubmit = useCallback((formName: string, formData: Record<string, unknown> = {}) => {
    trackAction('form_submit', { formName, ...formData });
  }, [trackAction]);

  const trackSearch = useCallback((query: string, filters: Record<string, unknown> = {}) => {
    trackAction('search', { query, filters });
  }, [trackAction]);

  return {
    trackAction,
    trackClick,
    trackFormSubmit,
    trackSearch,
  };
}

// Hook for tracking performance metrics
export function usePerformanceTracking() {
  const trackApiCall = useCallback(
    (endpoint: string, method: string, duration: number, status: number) => {
      performanceMonitor.trackApiCall(endpoint, method, duration, status);
    },
    []
  );

  const trackCustomMetric = useCallback((name: string, value: number, tags?: Record<string, string>) => {
    performanceMonitor.recordMetric({
      name,
      value,
      timestamp: new Date(),
      tags,
    });
  }, []);

  const trackError = useCallback((error: Error, context?: Record<string, unknown>) => {
    performanceMonitor.trackError(error, context);
  }, []);

  return {
    trackApiCall,
    trackCustomMetric,
    trackError,
  };
}

// Hook for matrimony-specific tracking
export function useMatrimonyTracking() {
  const { trackAction } = useActionTracking();

  const trackProfileAction = useCallback((
    action: 'view' | 'like' | 'interest_sent' | 'message_sent',
    targetProfileId: string
  ) => {
    userAnalytics.trackProfileAction(action, targetProfileId);
  }, []);

  const trackSubscriptionEvent = useCallback((
    event: 'upgrade_viewed' | 'upgrade_started' | 'upgrade_completed' | 'cancelled',
    plan?: string,
    amount?: number
  ) => {
    userAnalytics.trackSubscriptionEvent(event, plan, amount);
  }, []);

  const trackChatInteraction = useCallback((
    action: 'chat_opened' | 'message_sent' | 'message_received' | 'chat_closed',
    chatId: string,
    messageCount?: number
  ) => {
    userAnalytics.trackChatInteraction(action, chatId, messageCount);
  }, []);

  const trackMatchmaking = useCallback((
    action: 'matches_viewed' | 'filter_applied' | 'match_dismissed' | 'match_saved',
    metadata: Record<string, unknown> = {}
  ) => {
    trackAction(`matchmaking_${action}`, { category: 'matchmaking', ...metadata });
  }, [trackAction]);

  const trackVerification = useCallback((
    step: 'document_uploaded' | 'document_approved' | 'document_rejected' | 'manual_review',
    documentType?: string
  ) => {
    trackAction(`verification_${step}`, { category: 'verification', documentType });
  }, [trackAction]);

  return {
    trackProfileAction,
    trackSubscriptionEvent,
    trackChatInteraction,
    trackMatchmaking,
    trackVerification,
  };
}

// Hook for A/B testing
export function useABTesting() {
  const getVariant = useCallback((testName: string, variants: string[]): string => {
    // Simple hash-based variant selection
    const userId = localStorage.getItem('userId') || 'anonymous';
    const hash = Array.from(userId + testName).reduce((acc, char) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) & 0xffffffff;
    }, 0);
    
    const index = Math.abs(hash) % variants.length;
    const variant = variants[index];
    
    // Track variant assignment
    userAnalytics.trackAction('ab_test_variant_assigned', {
      testName,
      variant,
      category: 'ab_testing',
    });
    
    return variant;
  }, []);

  const trackConversion = useCallback((testName: string, variant: string, conversionType: string) => {
    userAnalytics.trackAction('ab_test_conversion', {
      testName,
      variant,
      conversionType,
      category: 'ab_testing',
    });
  }, []);

  return {
    getVariant,
    trackConversion,
  };
}

// Hook for real-time analytics dashboard
export function useAnalyticsDashboard() {
  const fetchPerformanceData = useCallback(async () => {
    try {
      const response = await fetch('/api/analytics?type=performance', {
        headers: {
          'Authorization': 'Bearer YOUR_AUTH_TOKEN', // Replace with actual token
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch performance data');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      return null;
    }
  }, []);

  const fetchUserSegments = useCallback(async () => {
    try {
      const response = await fetch('/api/analytics?type=segments', {
        headers: {
          'Authorization': 'Bearer YOUR_AUTH_TOKEN',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch user segments');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch user segments:', error);
      return null;
    }
  }, []);

  const fetchFunnelData = useCallback(async (funnelName: string) => {
    try {
      const response = await fetch(`/api/analytics?type=funnel&funnel=${funnelName}`, {
        headers: {
          'Authorization': 'Bearer YOUR_AUTH_TOKEN',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch funnel data');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch funnel data:', error);
      return null;
    }
  }, []);

  const exportAnalytics = useCallback(async (startDate: string, endDate: string) => {
    try {
      const response = await fetch(
        `/api/analytics?type=export&startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            'Authorization': 'Bearer YOUR_AUTH_TOKEN',
          },
        }
      );
      
      if (!response.ok) throw new Error('Failed to export analytics');
      
      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${startDate}-${endDate}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export analytics:', error);
    }
  }, []);

  return {
    fetchPerformanceData,
    fetchUserSegments,
    fetchFunnelData,
    exportAnalytics,
  };
}

// Higher-order component for automatic tracking
interface WithAnalyticsProps {
  children: React.ReactNode;
  trackingEnabled?: boolean;
}

export function withAnalytics<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  const WithAnalyticsComponent = (props: P & WithAnalyticsProps) => {
    const { trackingEnabled = true, ...rest } = props;

    useEffect(() => {
      if (trackingEnabled) {
        userAnalytics.trackAction('component_mounted', {
          componentName,
          category: 'component_lifecycle',
        });
      }

      return () => {
        if (trackingEnabled) {
          userAnalytics.trackAction('component_unmounted', {
            componentName,
            category: 'component_lifecycle',
          });
        }
      };
    }, [trackingEnabled]);

    return <WrappedComponent {...(rest as P)} />;
  };

  WithAnalyticsComponent.displayName = `withAnalytics(${componentName})`;
  return WithAnalyticsComponent;
}

// Context provider for analytics
import React, { createContext, useContext } from 'react';

interface AnalyticsContextType {
  isEnabled: boolean;
  userId?: string;
  sessionId: string;
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  isEnabled: true,
  sessionId: '',
});

export const useAnalyticsContext = () => useContext(AnalyticsContext);

interface AnalyticsProviderProps {
  children: React.ReactNode;
  isEnabled?: boolean;
  userId?: string;
}

export function AnalyticsProvider({ 
  children, 
  isEnabled = true, 
  userId 
}: AnalyticsProviderProps) {
  const sessionId = userAnalytics['currentSessionId'] || '';

  useEffect(() => {
    if (userId) {
      userAnalytics.identifyUser({
        userId,
        email: '', // You'd get this from your auth system
        registrationDate: new Date(),
        subscription: 'free', // Default value
        demographics: {},
      });
    }
  }, [userId]);

  const contextValue: AnalyticsContextType = {
    isEnabled,
    userId,
    sessionId,
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
}
