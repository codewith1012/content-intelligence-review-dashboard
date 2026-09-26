import type { ReactNode } from "react";

/**
 * Placeholder protected boundary. Later: read the session from FastAPI / Supabase Auth,
 * register a token via setAuthTokenProvider(), and render a sign-in screen when signed out.
 */
export function useCurrentUser() {
  return { user: { name: "Reviewer", email: "reviewer@company.com" }, isAuthenticated: true };
}

export function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useCurrentUser();
  if (!isAuthenticated) return null;
  return <>{children}</>;
}
