import { auth } from "@/data/auth/session-store";
import { apiFetch } from "@/data/providers/http-client";
import type {
  FollowersListResponseDTO,
  FollowListKind,
  FollowResponseDTO,
  UnfollowResponseDTO,
} from "@/domain/follows/follow.types";

type UserId = string | number;

const LIST_SEGMENTS: Record<FollowListKind, string> = {
  followers: "followers",
  following: "followers/following",
};

// The ids come from the URL, so they are encoded
const id = (userId: UserId) => encodeURIComponent(userId);

const keys = {
  count: (userId: UserId, kind: FollowListKind) =>
    `/api/users/${id(userId)}/${LIST_SEGMENTS[kind]}/count`,
  list: (userId: UserId, kind: FollowListKind) =>
    `/api/users/${id(userId)}/${LIST_SEGMENTS[kind]}`,
  isFollowing: (sessionId: UserId, targetId: UserId) =>
    `/api/users/${id(sessionId)}/followers/is-following/${id(targetId)}`,
};

// All of these endpoints require the JWT
export const followsService = {
  keys,
  // A plain number
  count: (userId: UserId, kind: FollowListKind) =>
    apiFetch<number>(keys.count(userId, kind), auth()),
  list: (userId: UserId, kind: FollowListKind) =>
    apiFetch<FollowersListResponseDTO>(keys.list(userId, kind), auth()),
  // A plain boolean
  isFollowing: (sessionId: UserId, targetId: UserId) =>
    apiFetch<boolean>(keys.isFollowing(sessionId, targetId), auth()),
  // POST follows, DELETE unfollows. Neither has a body
  follow: (userId: UserId) =>
    apiFetch<FollowResponseDTO>(`/api/users/${id(userId)}/follow`, {
      method: "POST",
      ...auth(),
    }),
  unfollow: (userId: UserId) =>
    apiFetch<UnfollowResponseDTO>(`/api/users/${id(userId)}/follow`, {
      method: "DELETE",
      ...auth(),
    }),
};
