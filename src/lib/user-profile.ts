import type { UserDTO, UserProfileResponse } from "@/domain/users/user.types";

// The fields shared by the own profile (UserDTO) and another user's (PublicUserProfileDTO)
export interface ProfileSummary {
  firstName: string;
  lastName: string;
  userName: string;
  description: string;
  profilePicture: string | null;
  categories: string[];
}

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

// "Valentina", "Ríos" → "VR"
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase();
}

// A non-numeric id comes back as 400, an unknown or deleted one as 404
export function isUserNotFound(status: number): boolean {
  return status === 400 || status === 404;
}
