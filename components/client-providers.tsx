"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { AnalyticsProvider, usePageTracking } from "@/lib/analytics/hooks";
import { useClearInvalidSession } from "@/lib/clear-invalid-session";

interface ClientProvidersProps {
  readonly children: React.ReactNode;
  readonly session: Session | null;
}

function AnalyticsWrapper({ children }: { readonly children: React.ReactNode }) {
  usePageTracking();
  useClearInvalidSession(); // Auto-clear invalid JWT sessions
  return <>{children}</>;
}

export function ClientProviders({ children, session }: ClientProvidersProps) {
  return (
    <SessionProvider session={session}>
      <AnalyticsProvider 
        isEnabled={process.env.NODE_ENV === 'production'}
        userId={session?.user?.id}
      >
        <AnalyticsWrapper>
          {children}
        </AnalyticsWrapper>
      </AnalyticsProvider>
    </SessionProvider>
  );
}
