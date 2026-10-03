import type { FollowerUserDTO } from "@/domain/follows/follow.types";

// The backend does not guarantee an order: newest first
export function sortByFollowedAtDesc(
  users: FollowerUserDTO[]
): FollowerUserDTO[] {
  return [...users].sort(
    (a, b) => new Date(b.followedAt).getTime() - new Date(a.followedAt).getTime()
  );
}
