import type {
  ProfileSummary,
  UserDTO,
  UserProfileResponse,
} from "@/domain/users/user.types";

// GET /api/users/{id} returns a UserDTO for the user's own id and for an ADMIN
export function isFullUserProfile(
  profile: UserProfileResponse
): profile is UserDTO {
  return "userInfo" in profile;
}

export function toProfileSummary(profile: UserProfileResponse): ProfileSummary {
  const source = isFullUserProfile(profile) ? profile.userInfo : profile;
  return {
    firstName: source.firstName,
    lastName: source.lastName,
    userName: source.userName,
    description: source.description,
    profilePicture: source.profilePicture,
    categories: profile.categories,
  };
}
