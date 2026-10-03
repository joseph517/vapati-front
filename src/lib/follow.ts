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

export function followerProfileHref(
  id: number,
  sessionId: number | undefined
): string {
  return id === sessionId ? "/profile" : `/users/${id}`;
}
