import { useCallback, useEffect, useState } from "react";
import { ApiClientError, apiFetch, UNEXPECTED_ERROR_MESSAGE } from "@/lib/api";
import {
  followListPath,
  sortByFollowedAtDesc,
  type FollowListKind,
  type LoadStatus,
} from "@/lib/follow";
import { useAuthStore } from "@/lib/store/auth-store";
import type { FollowerUserDTO, FollowersListResponseDTO } from "@/lib/types";

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
