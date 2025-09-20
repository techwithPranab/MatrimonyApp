import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import type { Session } from "next-auth";

export async function getSessionSafely(): Promise<Session | null> {
  try {
    const session = await getServerSession(authOptions);
    return session;
  } catch (error: unknown) {
    // Handle JWT decryption errors
    const err = error as Error;
    if (err?.name === 'JWEDecryptionFailed' || err?.message?.includes('decryption operation failed')) {
      console.warn("JWT decryption failed - likely due to changed secret or corrupted session. Clearing session.");
      return null;
    }
    
    // Handle other JWT-related errors
    if (err?.message?.includes('JWT')) {
      console.warn("JWT error occurred:", err.message);
      return null;
    }
    
    // Log unexpected errors but don't crash the app
    console.error("Unexpected session error:", err);
    return null;
  }
}

export async function requireAuth() {
  const session = await getSessionSafely();
  if (!session) {
    throw new Error("Authentication required");
  }
  return session;
}

export async function requireAdminAuth() {
  const session = await requireAuth();
  
  if (!session.user?.roles?.includes('admin')) {
    throw new Error("Admin access required");
  }
  
  return session;
}
