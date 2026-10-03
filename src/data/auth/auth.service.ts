import { useAuthStore } from "@/data/auth/session-store";
import { apiFetch } from "@/data/providers/http-client";
import type { AuthResponse } from "@/domain/auth/auth.types";

// The refresh (POST /auth/refresh-token) stays in the http-client.
export const authService = {
  // Public
  login: (email: string, password: string) =>
    apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  // POST /auth/logout with the stored refreshToken. Skipped without a refreshToken.
  // Never throws, and it does NOT clear the local session: callers do that.
  revokeRefreshToken: async (): Promise<void> => {
    const { accessToken, refreshToken } = useAuthStore.getState();
    if (!refreshToken) return;

    try {
      // Sent as a public request (no `accessToken` option) so a failure never
      // triggers a refresh or expires the session; the bearer goes as a plain header.
      await apiFetch("/auth/logout", {
        method: "POST",
        body: { refreshToken },
        headers: accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : undefined,
      });
    } catch {
      // Logout always succeeds locally, even if the backend call fails.
    }
  },
};
