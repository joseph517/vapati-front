import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/data/auth/session-store";
import { sortByFollowedAtDesc } from "@/data/follows/follows.adapter";
import { followsService } from "@/data/follows/follows.service";
import type {
  FollowListKind,
  FollowerUserDTO,
} from "@/domain/follows/follow.types";
import {
  ApiClientError,
  UNEXPECTED_ERROR_MESSAGE,
} from "@/domain/shared/errors";
import type { LoadStatus } from "@/domain/shared/shared.types";

// GET followers or followers/following. Lives inside the list dialog's content,
// which mounts on every opening, so the list is fetched each time it opens.
export function useFollowList(userId: string, kind: FollowListKind) {
  // Only a dependency: a new token fetches the list again
  const accessToken = useAuthStore((state) => state.accessToken);

  const [status, setStatus] = useState<LoadStatus>("loading");
  const [users, setUsers] = useState<FollowerUserDTO[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const retry = useCallback(() => {
    setStatus("loading");
    setError(null);
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    followsService
      .list(userId, kind)
      .then((data) => {
        if (cancelled) return;
        setUsers(sortByFollowedAtDesc(data.followers));
        setTotal(data.totalFollowers);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiClientError ? err.message : UNEXPECTED_ERROR_MESSAGE
        );
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [userId, kind, accessToken, reloadToken]);

  return { status, users, total, error, retry };
}
