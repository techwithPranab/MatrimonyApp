"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { AnalyticsProvider, usePageTracking } from "@/lib/analytics/hooks";

interface ClientProvidersProps {
  readonly children: React.ReactNode;
  readonly session: Session | null;
}

function AnalyticsWrapper({ children }: { readonly children: React.ReactNode }) {
  usePageTracking();
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
