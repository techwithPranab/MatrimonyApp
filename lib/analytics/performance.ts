// Performance monitoring and analytics service
interface PerformanceMetric {
  readonly name: string;
  readonly value: number;
  readonly timestamp: Date;
  readonly tags?: Record<string, string>;
  readonly metadata?: Record<string, unknown>;
}

interface ErrorLog {
  readonly id: string;
  readonly message: string;
  readonly stack?: string;
  readonly url: string;
  readonly userAgent: string;
  readonly userId?: string;
  readonly timestamp: Date;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly metadata?: Record<string, unknown>;
}

interface UserEvent {
  readonly eventType: string;
  readonly userId?: string;
  readonly sessionId: string;
  readonly timestamp: Date;
  readonly properties: Record<string, unknown>;
  readonly pageUrl: string;
}

interface ConversionEvent {
  readonly eventName: string;
  readonly userId: string;
  readonly value?: number;
  readonly currency?: string;
  readonly timestamp: Date;
  readonly funnel: string;
  readonly step: number;
  readonly metadata?: Record<string, unknown>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private errors: ErrorLog[] = [];
  private userEvents: UserEvent[] = [];
  private conversions: ConversionEvent[] = [];
  private readonly maxStorageSize = 1000; // Prevent memory issues

  // Core Web Vitals tracking
  trackWebVitals(): void {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric({
          name: 'lcp',
          value: entry.startTime,
          timestamp: new Date(),
          tags: { type: 'web-vital' },
        });
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // First Input Delay (FID)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as PerformanceEventTiming[]) {
        this.recordMetric({
          name: 'fid',
          value: entry.processingStart - entry.startTime,
          timestamp: new Date(),
          tags: { type: 'web-vital' },
        });
      }
    }).observe({ type: 'first-input', buffered: true });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value || 0;
        }
      }
      this.recordMetric({
        name: 'cls',
        value: clsValue,
        timestamp: new Date(),
        tags: { type: 'web-vital' },
      });
    }).observe({ type: 'layout-shift', buffered: true });

    // Time to First Byte (TTFB)
    window.addEventListener('load', () => {
      const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navTiming) {
        this.recordMetric({
          name: 'ttfb',
          value: navTiming.responseStart - navTiming.requestStart,
          timestamp: new Date(),
          tags: { type: 'web-vital' },
        });
      }
    });
  }

  // Custom performance metrics
  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    this.trimStorage();
    
    // Send to analytics service (implement based on your provider)
    this.sendToAnalytics('metric', metric);
  }

  // Error tracking
  trackError(error: Error, context?: Record<string, unknown>): void {
    const errorLog: ErrorLog = {
      id: `error-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      message: error.message,
      stack: error.stack,
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      timestamp: new Date(),
      severity: this.determineSeverity(error),
      metadata: context,
    };

    this.errors.push(errorLog);
    this.trimStorage();
    
    // Send to error tracking service
    this.sendToAnalytics('error', errorLog);
  }

  // User event tracking
  trackUserEvent(eventType: string, properties: Record<string, unknown> = {}): void {
    const userEvent: UserEvent = {
      eventType,
      sessionId: this.getSessionId(),
      timestamp: new Date(),
      properties,
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      userId: this.getCurrentUserId(),
    };

    this.userEvents.push(userEvent);
    this.trimStorage();
    
    // Send to analytics service
    this.sendToAnalytics('event', userEvent);
  }

  // Conversion tracking
  trackConversion(eventName: string, funnel: string, step: number, value?: number): void {
    const userId = this.getCurrentUserId();
    if (!userId) return; // Only track conversions for authenticated users

    const conversion: ConversionEvent = {
      eventName,
      userId,
      value,
      currency: 'INR',
      timestamp: new Date(),
      funnel,
      step,
    };

    this.conversions.push(conversion);
    this.trimStorage();
    
    // Send to analytics service
    this.sendToAnalytics('conversion', conversion);
  }

  // Page performance tracking
  trackPageLoad(pageName: string): void {
    if (typeof window === 'undefined') return;

    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (perfData) {
      this.recordMetric({
        name: 'page_load_time',
        value: perfData.loadEventEnd - perfData.fetchStart,
        timestamp: new Date(),
        tags: { page: pageName, type: 'page-performance' },
      });

      this.recordMetric({
        name: 'dom_content_loaded',
        value: perfData.domContentLoadedEventEnd - perfData.fetchStart,
        timestamp: new Date(),
        tags: { page: pageName, type: 'page-performance' },
      });
    }
  }

  // API performance tracking
  trackApiCall(endpoint: string, method: string, duration: number, status: number): void {
    this.recordMetric({
      name: 'api_response_time',
      value: duration,
      timestamp: new Date(),
      tags: { 
        endpoint, 
        method, 
        status: status.toString(),
        type: 'api-performance' 
      },
    });

    // Track API errors
    if (status >= 400) {
      this.trackUserEvent('api_error', {
        endpoint,
        method,
        status,
        duration,
      });
    }
  }

  // Database query performance tracking
  trackDatabaseQuery(query: string, duration: number, collection?: string): void {
    this.recordMetric({
      name: 'db_query_time',
      value: duration,
      timestamp: new Date(),
      tags: { 
        collection: collection || 'unknown',
        type: 'db-performance' 
      },
      metadata: { query: query.substring(0, 100) }, // Truncate for privacy
    });
  }

  // Real-time performance dashboard data
  getPerformanceSnapshot(): {
    webVitals: Record<string, number>;
    errorRate: number;
    avgResponseTime: number;
    activeUsers: number;
    conversionRate: number;
  } {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Recent metrics
    const recentMetrics = this.metrics.filter(m => m.timestamp > oneHourAgo);
    
    // Web Vitals averages
    const webVitals: Record<string, number> = {};
    ['lcp', 'fid', 'cls', 'ttfb'].forEach(vital => {
      const vitalMetrics = recentMetrics.filter(m => m.name === vital);
      if (vitalMetrics.length > 0) {
        webVitals[vital] = vitalMetrics.reduce((sum, m) => sum + m.value, 0) / vitalMetrics.length;
      }
    });

    // Error rate
    const recentErrors = this.errors.filter(e => e.timestamp > oneHourAgo);
    const totalEvents = this.userEvents.filter(e => e.timestamp > oneHourAgo).length;
    const errorRate = totalEvents > 0 ? (recentErrors.length / totalEvents) * 100 : 0;

    // Average API response time
    const apiMetrics = recentMetrics.filter(m => m.name === 'api_response_time');
    const avgResponseTime = apiMetrics.length > 0 
      ? apiMetrics.reduce((sum, m) => sum + m.value, 0) / apiMetrics.length 
      : 0;

    // Active users (unique sessions in last hour)
    const uniqueSessions = new Set(
      this.userEvents
        .filter(e => e.timestamp > oneHourAgo)
        .map(e => e.sessionId)
    );
    const activeUsers = uniqueSessions.size;

    // Conversion rate
    const recentConversions = this.conversions.filter(c => c.timestamp > oneHourAgo);
    const conversionRate = activeUsers > 0 ? (recentConversions.length / activeUsers) * 100 : 0;

    return {
      webVitals,
      errorRate,
      avgResponseTime,
      activeUsers,
      conversionRate,
    };
  }

  // Analytics export for external services
  exportAnalytics(timeRange: { start: Date; end: Date }): {
    metrics: PerformanceMetric[];
    errors: ErrorLog[];
    events: UserEvent[];
    conversions: ConversionEvent[];
  } {
    return {
      metrics: this.metrics.filter(m => m.timestamp >= timeRange.start && m.timestamp <= timeRange.end),
      errors: this.errors.filter(e => e.timestamp >= timeRange.start && e.timestamp <= timeRange.end),
      events: this.userEvents.filter(e => e.timestamp >= timeRange.start && e.timestamp <= timeRange.end),
      conversions: this.conversions.filter(c => c.timestamp >= timeRange.start && c.timestamp <= timeRange.end),
    };
  }

  // Utility methods
  private determineSeverity(error: Error): ErrorLog['severity'] {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'medium';
    }
    
    if (message.includes('chunk') || message.includes('loading')) {
      return 'low';
    }
    
    if (message.includes('security') || message.includes('auth')) {
      return 'critical';
    }
    
    return 'medium';
  }

  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server-session';
    
    let sessionId = sessionStorage.getItem('analytics-session-id');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      sessionStorage.setItem('analytics-session-id', sessionId);
    }
    return sessionId;
  }

  private getCurrentUserId(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    
    // This would typically come from your auth system
    return localStorage.getItem('userId') || undefined;
  }

  private trimStorage(): void {
    if (this.metrics.length > this.maxStorageSize) {
      this.metrics = this.metrics.slice(-this.maxStorageSize);
    }
    
    if (this.errors.length > this.maxStorageSize) {
      this.errors = this.errors.slice(-this.maxStorageSize);
    }
    
    if (this.userEvents.length > this.maxStorageSize) {
      this.userEvents = this.userEvents.slice(-this.maxStorageSize);
    }
    
    if (this.conversions.length > this.maxStorageSize) {
      this.conversions = this.conversions.slice(-this.maxStorageSize);
    }
  }

  private async sendToAnalytics(type: string, data: unknown): Promise<void> {
    try {
      // In a real implementation, you would send this to your analytics service
      // Examples: Google Analytics, Mixpanel, Amplitude, custom backend
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics] ${type}:`, data);
        return;
      }

      // Example: Send to custom analytics endpoint
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          data,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      // Don't let analytics errors affect the main application
      console.warn('Failed to send analytics data:', error);
    }
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Initialize performance monitoring when imported
if (typeof window !== 'undefined') {
  performanceMonitor.trackWebVitals();
  
  // Track global errors
  window.addEventListener('error', (event) => {
    performanceMonitor.trackError(event.error || new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    performanceMonitor.trackError(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      { type: 'unhandled-promise-rejection' }
    );
  });

  // Track page navigation
  let lastUrl = window.location.href;
  new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      performanceMonitor.trackUserEvent('page_navigation', {
        from: lastUrl,
        to: currentUrl,
      });
      lastUrl = currentUrl;
    }
  }).observe(document, { subtree: true, childList: true });
}

export default performanceMonitor;
