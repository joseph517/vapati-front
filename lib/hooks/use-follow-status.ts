import { useEffect, useRef, useState } from "react";
import { ApiClientError, apiFetch, UNEXPECTED_ERROR_MESSAGE } from "@/lib/api";
import { followPath, isFollowingPath, type LoadStatus } from "@/lib/follow";
import { useAuthStore } from "@/lib/store/auth-store";
import type { FollowResponseDTO, UnfollowResponseDTO } from "@/lib/types";

interface FollowersCounter {
  adjust: (delta: 1 | -1) => void;
  refetch: () => void;
}

function toErrorMessage(err: unknown): string {
  return err instanceof ApiClientError ? err.message : UNEXPECTED_ERROR_MESSAGE;
}

// State of the "Seguir" button. With targetUserId === null (own profile) it does not
// call is-following. A 409 when following and a 404 when unfollowing mean the state
// was already the requested one: no error, and the followers count is fetched again.
export function useFollowStatus(
  targetUserId: string | null,
  followers: FollowersCounter
) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionUserId = useAuthStore((state) => state.userInfo?.userId);

  const [status, setStatus] = useState<LoadStatus>("loading");
  const [following, setFollowing] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start over when navigating to another user
  // (see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes).
  const [loadedForUser, setLoadedForUser] = useState(targetUserId);
  if (loadedForUser !== targetUserId) {
    setLoadedForUser(targetUserId);
    setStatus("loading");
    setFollowing(false);
    setPending(false);
    setError(null);
  }

  // A toggle that resolves after navigating to another user is discarded
  const currentTarget = useRef(targetUserId);
  useEffect(() => {
    currentTarget.current = targetUserId;
  }, [targetUserId]);

  useEffect(() => {
    if (targetUserId === null || sessionUserId === undefined) return;
    let cancelled = false;

    apiFetch<boolean>(
      isFollowingPath(sessionUserId, encodeURIComponent(targetUserId)),
      { accessToken }
    )
      .then((value) => {
        if (cancelled) return;
        setFollowing(value);
        setStatus("ready");
      })
      .catch(() => {
        // Without is-following there is no button: the message is not shown
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [targetUserId, sessionUserId, accessToken]);

  async function follow(target: string) {
    try {
      await apiFetch<FollowResponseDTO>(
        followPath(encodeURIComponent(target)),
        { method: "POST", accessToken }
      );
      if (currentTarget.current !== target) return;
      setFollowing(true);
      followers.adjust(1);
    } catch (err) {
      if (currentTarget.current !== target) return;
      if (err instanceof ApiClientError && err.status === 409) {
        // Already followed
        setFollowing(true);
        followers.refetch();
      } else {
        setError(toErrorMessage(err));
      }
    }
  }

  async function unfollow(target: string, sessionId: number) {
    try {
      await apiFetch<UnfollowResponseDTO>(
        followPath(encodeURIComponent(target)),
        { method: "DELETE", accessToken }
      );
      if (currentTarget.current !== target) return;
      setFollowing(false);
      followers.adjust(-1);
    } catch (err) {
      if (currentTarget.current !== target) return;
      if (!(err instanceof ApiClientError && err.status === 404)) {
        setError(toErrorMessage(err));
        return;
      }
      // The 404 doesn't say whether the follow or the user is missing: ask again
      try {
        const stillFollowing = await apiFetch<boolean>(
          isFollowingPath(sessionId, encodeURIComponent(target)),
          { accessToken }
        );
        if (currentTarget.current !== target) return;
        if (stillFollowing) {
          setError(err.message);
        } else {
          setFollowing(false);
          followers.refetch();
        }
      } catch {
        if (currentTarget.current === target) setError(err.message);
      }
    }
  }

  async function toggle() {
    if (
      pending ||
      status !== "ready" ||
      targetUserId === null ||
      sessionUserId === undefined
    ) {
      return;
    }
    setError(null);
    setPending(true);
    if (following) {
      await unfollow(targetUserId, sessionUserId);
    } else {
      await follow(targetUserId);
    }
    // After navigating, the reset in render already cleared `pending`
    if (currentTarget.current === targetUserId) setPending(false);
  }

  const dismissError = () => setError(null);

  return { status, following, pending, error, toggle, dismissError };
}
