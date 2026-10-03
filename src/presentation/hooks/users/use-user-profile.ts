import { useCallback } from "react";
import { usersService } from "@/data/users/users.service";
import { useApiQuery } from "@/presentation/hooks/shared/use-api-query";

// GET /api/users/{userId}. With userId === null it does not fetch and stays in loading
// (used while redirecting to /profile).
export function useUserProfile(userId: string | null) {
  const { data, loading, error, reload: reloadQuery } = useApiQuery(
    userId === null ? null : usersService.keys.profile(userId),
    // Only called with a non-null key, so userId is not null
    () => usersService.getProfile(userId!)
  );

  const reload = useCallback(() => reloadQuery(), [reloadQuery]);

  return { profile: data, loading: userId === null || loading, error, reload };
}
