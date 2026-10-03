import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/data/auth/session-store";
import { followsService } from "@/data/follows/follows.service";
import type {
  FollowCount,
  FollowListKind,
} from "@/domain/follows/follow.types";

const LOADING_COUNT: FollowCount = { status: "loading", value: null };

// Fetches one count. Returns the cleanup that discards a late response.
function loadCount(
  userId: string,
  kind: FollowListKind,
  setCount: (count: FollowCount) => void
): () => void {
  let cancelled = false;

  followsService
    .count(userId, kind)
    .then((value) => {
      if (!cancelled) setCount({ status: "ready", value });
    })
    .catch(() => {
      // The counter only shows "—": the message is not needed
      if (!cancelled) setCount({ status: "error", value: null });
    });

  return () => {
    cancelled = true;
  };
}

// GET followers/count and followers/following/count in parallel.
// With userId === null it does not fetch and stays in loading (own profile on /users/[userId]).
export function useFollowCounts(userId: string | null) {
  // Only a dependency: a new token fetches the counts again
  const accessToken = useAuthStore((state) => state.accessToken);

  const [followers, setFollowers] = useState<FollowCount>(LOADING_COUNT);
  const [following, setFollowing] = useState<FollowCount>(LOADING_COUNT);
  const [followersReloadToken, setFollowersReloadToken] = useState(0);

  // Start over when navigating to another user
  // (see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes).
  const [loadedForUser, setLoadedForUser] = useState(userId);
  if (loadedForUser !== userId) {
    setLoadedForUser(userId);
    setFollowers(LOADING_COUNT);
    setFollowing(LOADING_COUNT);
  }

  const refetchFollowers = useCallback(() => {
    setFollowers(LOADING_COUNT);
    setFollowersReloadToken((token) => token + 1);
  }, []);

  // Without a ready value there is no base to add to, so it fetches again
  const adjustFollowers = useCallback(
    (delta: 1 | -1) => {
      if (followers.status !== "ready") {
        refetchFollowers();
        return;
      }
      setFollowers((current) => ({
        status: "ready",
        value: Math.max(0, (current.value ?? 0) + delta),
      }));
    },
    [followers.status, refetchFollowers]
  );

  useEffect(() => {
    if (userId === null) return;
    return loadCount(userId, "followers", setFollowers);
  }, [userId, accessToken, followersReloadToken]);

  useEffect(() => {
    if (userId === null) return;
    return loadCount(userId, "following", setFollowing);
  }, [userId, accessToken]);

  return { followers, following, refetchFollowers, adjustFollowers };
}
