import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/data/auth/session-store";
import { apiFetch } from "@/data/providers/http-client";
import type {
  FollowListKind,
  FollowerUserDTO,
  FollowersListResponseDTO,
} from "@/domain/follows/follow.types";
import {
  ApiClientError,
  UNEXPECTED_ERROR_MESSAGE,
} from "@/domain/shared/errors";
import type { LoadStatus } from "@/domain/shared/shared.types";
import { followListPath, sortByFollowedAtDesc } from "@/lib/follow";

// GET followers or followers/following. Lives inside the list dialog's content,
// which mounts on every opening, so the list is fetched each time it opens.
export function useFollowList(userId: string, kind: FollowListKind) {
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

    apiFetch<FollowersListResponseDTO>(
      followListPath(encodeURIComponent(userId), kind),
      { accessToken }
    )
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
