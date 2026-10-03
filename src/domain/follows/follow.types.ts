import type { LoadStatus } from "@/domain/shared/shared.types";

export type FollowListKind = "followers" | "following";
export type FollowAudience = "own" | "public";

export interface FollowCount {
  status: LoadStatus;
  value: number | null; // null while loading or on error
}

// A row of the follower lists (user/follower step)
export interface FollowerUserDTO {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  profilePicture: string | null; // free-form URL
  followedAt: string; // ISO LocalDateTime without zone
}

// GET /api/users/{userId}/followers and /followers/following.
// In /followers/following, `followers` are the followed users and `totalFollowers` their count.
export interface FollowersListResponseDTO {
  userId: number;
  totalFollowers: number;
  followers: FollowerUserDTO[];
}

// POST /api/users/{userId}/follow
export interface FollowResponseDTO {
  message: string;
  success: true;
  followedUser: FollowerUserDTO;
}

// DELETE /api/users/{userId}/follow
export interface UnfollowResponseDTO {
  message: string;
  success: true;
  unfollowedUserId: number;
}

// The count endpoints respond a plain number; is-following, a plain boolean.
