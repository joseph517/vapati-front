import type {
  FollowAudience,
  FollowListKind,
} from "@/domain/follows/follow.types";

export const FOLLOW_LIST_TITLES: Record<FollowListKind, string> = {
  followers: "Seguidores",
  following: "Seguidos",
};

export const FOLLOW_LIST_EMPTY_TEXTS: Record<
  FollowAudience,
  Record<FollowListKind, string>
> = {
  public: {
    followers: "Todavía no tiene seguidores.",
    following: "Todavía no sigue a nadie.",
  },
  own: {
    followers: "Todavía no tenés seguidores.",
    following: "Todavía no seguís a nadie.",
  },
};

type UserId = string | number;

const LIST_SEGMENTS: Record<FollowListKind, string> = {
  followers: "followers",
  following: "followers/following",
};

// All of these endpoints require the JWT
export function followCountPath(userId: UserId, kind: FollowListKind): string {
  return `/api/users/${userId}/${LIST_SEGMENTS[kind]}/count`;
}

export function followListPath(userId: UserId, kind: FollowListKind): string {
  return `/api/users/${userId}/${LIST_SEGMENTS[kind]}`;
}

export function isFollowingPath(sessionId: UserId, targetId: UserId): string {
  return `/api/users/${sessionId}/followers/is-following/${targetId}`;
}

// POST follows, DELETE unfollows. Neither has a body
export function followPath(userId: UserId): string {
  return `/api/users/${userId}/follow`;
}

export function followerProfileHref(
  id: number,
  sessionId: number | undefined
): string {
  return id === sessionId ? "/profile" : `/users/${id}`;
}
