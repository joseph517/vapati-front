import { useCallback, useEffect, useState } from "react";
import { apiFetch, toQueryError } from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth-store";
import type { UserProfileResponse } from "@/lib/types";

export interface UserProfileError {
  status: number; // ApiClientError.status (0 without a connection)
  message: string;
}

// GET /api/users/{userId}. With userId === null it does not fetch and stays in loading
// (used while redirecting to /profile).
export function useUserProfile(userId: string | null) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<UserProfileError | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  // Start over when navigating to another user
  // (see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes).
  const [loadedForUser, setLoadedForUser] = useState(userId);
  if (loadedForUser !== userId) {
    setLoadedForUser(userId);
    setProfile(null);
    setLoading(true);
    setError(null);
  }

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    if (userId === null) return;
    let cancelled = false;

    apiFetch<UserProfileResponse>(
      `/api/users/${encodeURIComponent(userId)}`,
      { accessToken }
    )
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(toQueryError(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, accessToken, reloadToken]);

  return { profile, loading, error, reload };
}
