// User analytics and behavior tracking
import { performanceMonitor } from './performance';

interface UserProfile {
  readonly userId: string;
  readonly email: string;
  readonly registrationDate: Date;
  readonly subscription: 'free' | 'premium' | 'gold';
  readonly demographics: {
    readonly age?: number;
    readonly gender?: string;
    readonly location?: string;
    readonly education?: string;
    readonly profession?: string;
  };
}

interface UserSession {
  readonly sessionId: string;
  readonly userId?: string;
  readonly startTime: Date;
  readonly endTime?: Date;
  readonly pageViews: number;
  readonly actions: UserAction[];
  readonly deviceInfo: DeviceInfo;
}

interface UserAction {
  readonly actionType: string;
  readonly timestamp: Date;
  readonly metadata: Record<string, unknown>;
  readonly pageUrl: string;
  readonly elementId?: string;
}

interface DeviceInfo {
  readonly userAgent: string;
  readonly screenResolution: string;
  readonly viewportSize: string;
  readonly deviceType: 'mobile' | 'tablet' | 'desktop';
  readonly browser: string;
  readonly os: string;
}

interface FunnelStep {
  readonly step: number;
  readonly name: string;
  readonly url: string;
  readonly expectedAction: string;
}

interface ConversionFunnel {
  readonly name: string;
  readonly steps: FunnelStep[];
  readonly userJourney: Map<string, number>; // userId -> current step
}

class UserAnalytics {
  private readonly sessions: Map<string, UserSession> = new Map();
  private readonly userProfiles: Map<string, UserProfile> = new Map();
  private readonly funnels: Map<string, ConversionFunnel> = new Map();
  private currentSessionId: string | null = null;

  constructor() {
    this.initializeFunnels();
    this.startSession();
  }

  // Session management
  startSession(): string {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const session: UserSession = {
      sessionId,
      startTime: new Date(),
      pageViews: 0,
      actions: [],
      deviceInfo: this.getDeviceInfo(),
    };

    this.sessions.set(sessionId, session);
    this.currentSessionId = sessionId;

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('analytics-session-id', sessionId);
    }

    return sessionId;
  }

  endSession(): void {
    if (!this.currentSessionId) return;

    const session = this.sessions.get(this.currentSessionId);
    if (session) {
      const updatedSession = {
        ...session,
        endTime: new Date(),
      };
      this.sessions.set(this.currentSessionId, updatedSession);
      
      // Track session analytics
      this.trackSessionEnd(updatedSession);
    }

    this.currentSessionId = null;
  }

  // User identification
  identifyUser(userProfile: UserProfile): void {
    this.userProfiles.set(userProfile.userId, userProfile);
    
    // Update current session with user ID
    if (this.currentSessionId) {
      const session = this.sessions.get(this.currentSessionId);
      if (session) {
        this.sessions.set(this.currentSessionId, {
          ...session,
          userId: userProfile.userId,
        });
      }
    }

    // Track user identification
    performanceMonitor.trackUserEvent('user_identified', {
      userId: userProfile.userId,
      subscription: userProfile.subscription,
      demographics: userProfile.demographics,
    });
  }

  // Page tracking
  trackPageView(pageName: string, pageUrl: string, metadata?: Record<string, unknown>): void {
    if (!this.currentSessionId) {
      this.startSession();
    }

    const session = this.sessions.get(this.currentSessionId!)!;
    const updatedSession = {
      ...session,
      pageViews: session.pageViews + 1,
    };
    this.sessions.set(this.currentSessionId!, updatedSession);

    // Track with performance monitor
    performanceMonitor.trackUserEvent('page_view', {
      pageName,
      pageUrl,
      sessionId: this.currentSessionId,
      ...metadata,
    });

    // Track page load performance
    performanceMonitor.trackPageLoad(pageName);

    // Check funnel progression
    this.checkFunnelProgression(pageUrl);
  }

  // Action tracking
  trackAction(
    actionType: string, 
    metadata: Record<string, unknown> = {}, 
    elementId?: string
  ): void {
    if (!this.currentSessionId) {
      this.startSession();
    }

    const action: UserAction = {
      actionType,
      timestamp: new Date(),
      metadata,
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      elementId,
    };

    const session = this.sessions.get(this.currentSessionId!)!;
    const updatedSession = {
      ...session,
      actions: [...session.actions, action],
    };
    this.sessions.set(this.currentSessionId!, updatedSession);

    // Track with performance monitor
    performanceMonitor.trackUserEvent(actionType, {
      ...metadata,
      elementId,
      sessionId: this.currentSessionId,
    });

    // Check funnel progression for actions
    this.checkFunnelProgression(undefined, actionType);
  }

  // Matrimony-specific tracking
  trackProfileAction(action: 'view' | 'like' | 'interest_sent' | 'message_sent', targetProfileId: string): void {
    this.trackAction(`profile_${action}`, {
      targetProfileId,
      category: 'profile_interaction',
    });

    // Track conversion for paid features
    const userId = this.getCurrentUserId();
    if (userId && ['interest_sent', 'message_sent'].includes(action)) {
      performanceMonitor.trackConversion(`profile_${action}`, 'engagement', 1);
    }
  }

  trackSearchAction(
    searchType: 'basic' | 'advanced',
    filters: Record<string, unknown>,
    resultsCount: number
  ): void {
    this.trackAction('search_performed', {
      searchType,
      filters,
      resultsCount,
      category: 'search',
    });
  }

  trackSubscriptionEvent(
    event: 'upgrade_viewed' | 'upgrade_started' | 'upgrade_completed' | 'cancelled',
    plan?: string,
    amount?: number
  ): void {
    this.trackAction(`subscription_${event}`, {
      plan,
      amount,
      category: 'subscription',
    });

    // Track as conversion
    if (event === 'upgrade_completed' && plan && amount) {
      performanceMonitor.trackConversion('subscription_purchase', 'subscription', 1, amount);
    }
  }

  trackChatInteraction(
    action: 'chat_opened' | 'message_sent' | 'message_received' | 'chat_closed',
    chatId: string,
    messageCount?: number
  ): void {
    this.trackAction(`chat_${action}`, {
      chatId,
      messageCount,
      category: 'communication',
    });
  }

  // Funnel management
  private initializeFunnels(): void {
    // Registration funnel
    this.funnels.set('registration', {
      name: 'User Registration',
      steps: [
        { step: 1, name: 'Landing Page', url: '/', expectedAction: 'page_view' },
        { step: 2, name: 'Sign Up Page', url: '/auth/sign-up', expectedAction: 'page_view' },
        { step: 3, name: 'Email Entered', url: '/auth/sign-up', expectedAction: 'email_entered' },
        { step: 4, name: 'OTP Verified', url: '/auth/verify-otp', expectedAction: 'otp_verified' },
        { step: 5, name: 'Profile Created', url: '/profile/edit', expectedAction: 'profile_completed' },
      ],
      userJourney: new Map(),
    });

    // Subscription funnel
    this.funnels.set('subscription', {
      name: 'Subscription Purchase',
      steps: [
        { step: 1, name: 'Free User', url: '/dashboard', expectedAction: 'page_view' },
        { step: 2, name: 'Upgrade Prompt', url: '/dashboard', expectedAction: 'upgrade_prompt_shown' },
        { step: 3, name: 'Pricing Page', url: '/pricing', expectedAction: 'page_view' },
        { step: 4, name: 'Plan Selected', url: '/pricing', expectedAction: 'plan_selected' },
        { step: 5, name: 'Payment Completed', url: '/subscription/success', expectedAction: 'subscription_upgrade_completed' },
      ],
      userJourney: new Map(),
    });

    // Match connection funnel
    this.funnels.set('connection', {
      name: 'Profile to Connection',
      steps: [
        { step: 1, name: 'Profile Viewed', url: '/profile/*', expectedAction: 'profile_view' },
        { step: 2, name: 'Interest Sent', url: '/profile/*', expectedAction: 'profile_interest_sent' },
        { step: 3, name: 'Interest Accepted', url: '/interests', expectedAction: 'interest_accepted' },
        { step: 4, name: 'Chat Started', url: '/chat/*', expectedAction: 'chat_opened' },
        { step: 5, name: 'Messages Exchanged', url: '/chat/*', expectedAction: 'chat_message_sent' },
      ],
      userJourney: new Map(),
    });
  }

  private checkFunnelProgression(url?: string, action?: string): void {
    const userId = this.getCurrentUserId();
    if (!userId) return;

    for (const [funnelName, funnel] of this.funnels) {
      const currentStep = funnel.userJourney.get(userId) || 0;
      const nextStep = currentStep + 1;
      
      if (nextStep <= funnel.steps.length) {
        const expectedStep = funnel.steps[nextStep - 1];
        
        const urlMatches = url && (
          expectedStep.url === url || 
          (expectedStep.url.includes('*') && url.includes(expectedStep.url.replace('*', '')))
        );
        
        const actionMatches = action && expectedStep.expectedAction === action;
        
        if (urlMatches || actionMatches) {
          funnel.userJourney.set(userId, nextStep);
          
          // Track funnel progression
          performanceMonitor.trackConversion(
            `funnel_${funnelName}_step_${nextStep}`,
            funnelName,
            nextStep
          );
        }
      }
    }
  }

  // Analytics reports
  getUserJourney(userId: string): UserAction[] {
    const userSessions = Array.from(this.sessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    return userSessions.flatMap(session => session.actions);
  }

  getFunnelAnalytics(funnelName: string): {
    totalUsers: number;
    stepConversions: Array<{ step: number; users: number; conversionRate: number }>;
    dropOffPoints: Array<{ fromStep: number; toStep: number; dropOffRate: number }>;
  } {
    const funnel = this.funnels.get(funnelName);
    if (!funnel) {
      throw new Error(`Funnel '${funnelName}' not found`);
    }

    const userSteps = Array.from(funnel.userJourney.values());
    const totalUsers = userSteps.length;

    const stepConversions = funnel.steps.map((step, index) => {
      const usersAtStep = userSteps.filter(userStep => userStep >= step.step).length;
      const conversionRate = totalUsers > 0 ? (usersAtStep / totalUsers) * 100 : 0;
      
      return {
        step: step.step,
        users: usersAtStep,
        conversionRate,
      };
    });

    const dropOffPoints = funnel.steps.slice(0, -1).map((step, index) => {
      const currentStepUsers = stepConversions[index].users;
      const nextStepUsers = stepConversions[index + 1].users;
      const dropOffRate = currentStepUsers > 0 
        ? ((currentStepUsers - nextStepUsers) / currentStepUsers) * 100 
        : 0;

      return {
        fromStep: step.step,
        toStep: step.step + 1,
        dropOffRate,
      };
    });

    return {
      totalUsers,
      stepConversions,
      dropOffPoints,
    };
  }

  getUserSegments(): Record<string, UserProfile[]> {
    const segments: Record<string, UserProfile[]> = {
      free_users: [],
      premium_users: [],
      gold_users: [],
      new_users: [],
      active_users: [],
      churned_users: [],
    };

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    for (const profile of this.userProfiles.values()) {
      // Subscription segments
      segments[`${profile.subscription}_users`].push(profile);

      // Activity segments
      if (profile.registrationDate > sevenDaysAgo) {
        segments.new_users.push(profile);
      }

      const userSessions = Array.from(this.sessions.values())
        .filter(session => session.userId === profile.userId);
      
      const recentActivity = userSessions.some(session => 
        session.startTime > sevenDaysAgo
      );

      if (recentActivity) {
        segments.active_users.push(profile);
      } else if (userSessions.length > 0) {
        const lastActivity = Math.max(
          ...userSessions.map(session => session.startTime.getTime())
        );
        
        if (new Date(lastActivity) < thirtyDaysAgo) {
          segments.churned_users.push(profile);
        }
      }
    }

    return segments;
  }

  // Utility methods
  private getDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
      return {
        userAgent: 'server',
        screenResolution: 'unknown',
        viewportSize: 'unknown',
        deviceType: 'desktop',
        browser: 'unknown',
        os: 'unknown',
      };
    }

    const userAgent = navigator.userAgent;
    const screenResolution = `${screen.width}x${screen.height}`;
    const viewportSize = `${window.innerWidth}x${window.innerHeight}`;
    
    let deviceType: DeviceInfo['deviceType'] = 'desktop';
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      deviceType = /iPad/.test(userAgent) ? 'tablet' : 'mobile';
    }

    const browser = this.detectBrowser(userAgent);
    const os = this.detectOS(userAgent);

    return {
      userAgent,
      screenResolution,
      viewportSize,
      deviceType,
      browser,
      os,
    };
  }

  private detectBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private detectOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    return 'Unknown';
  }

  private getCurrentUserId(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    return localStorage.getItem('userId') || undefined;
  }

  private trackSessionEnd(session: UserSession): void {
    const duration = session.endTime 
      ? session.endTime.getTime() - session.startTime.getTime()
      : 0;

    performanceMonitor.trackUserEvent('session_end', {
      sessionId: session.sessionId,
      userId: session.userId,
      duration,
      pageViews: session.pageViews,
      actions: session.actions.length,
      deviceType: session.deviceInfo.deviceType,
    });
  }
}

// Export singleton instance
export const userAnalytics = new UserAnalytics();

// Auto-track page changes in browser
if (typeof window !== 'undefined') {
  // Track initial page load
  window.addEventListener('load', () => {
    userAnalytics.trackPageView(document.title, window.location.href);
  });

  // Track page unload
  window.addEventListener('beforeunload', () => {
    userAnalytics.endSession();
  });

  // Track visibility changes (user switching tabs)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      userAnalytics.trackAction('page_hidden');
    } else {
      userAnalytics.trackAction('page_visible');
    }
  });
}

export default userAnalytics;
