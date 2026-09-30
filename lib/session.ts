import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth-store";

// POST /auth/logout with the stored refreshToken. Skipped without a refreshToken.
// Never throws, and it does NOT clear the local session: callers do that.
export async function revokeRefreshToken(): Promise<void> {
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
}
