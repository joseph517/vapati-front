import { useCallback } from "react";
import { useApiQuery } from "@/lib/hooks/use-api-query";
import type { UserProfileResponse } from "@/lib/types";

// GET /api/users/{userId}. With userId === null it does not fetch and stays in loading
// (used while redirecting to /profile).
export function useUserProfile(userId: string | null) {
  const { data, loading, error, reload: reloadQuery } =
    useApiQuery<UserProfileResponse>(
      userId === null ? null : `/api/users/${encodeURIComponent(userId)}`
    );

  const reload = useCallback(() => reloadQuery(), [reloadQuery]);

  return { profile: data, loading: userId === null || loading, error, reload };
}
