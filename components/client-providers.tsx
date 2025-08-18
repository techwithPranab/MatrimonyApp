"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

interface ClientProvidersProps {
  readonly children: React.ReactNode;
  readonly session: Session | null;
}

export function ClientProviders({ children, session }: ClientProvidersProps) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}
