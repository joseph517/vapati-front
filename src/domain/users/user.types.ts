// Also used by the user/bankaccount step. Not shown while that step is postponed.
export interface BankAccountDTO {
  id: number;
  userId: number;
  bankName: string;
  accountNumber: string;
  accountType: string;
  accountHolder: string;
}

export interface UserInfoDTO {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phone: string;
  description: string;
  profilePicture: string | null; // null or "" without a photo
}

// Full profile: for the user's own id and for an ADMIN
export interface UserDTO {
  id: number;
  verified: boolean; // not shown
  categories: string[]; // category NAMES, not ids
  userInfo: UserInfoDTO;
  bankAccounts: BankAccountDTO[]; // not shown
}

// Another user's profile
export interface PublicUserProfileDTO {
  id: number;
  categories: string[]; // names
  firstName: string;
  lastName: string;
  userName: string;
  description: string;
  profilePicture: string | null; // null or "" without a photo
}

// The fields shared by the own profile (UserDTO) and another user's (PublicUserProfileDTO)
export interface ProfileSummary {
  firstName: string;
  lastName: string;
  userName: string;
  description: string;
  profilePicture: string | null;
  categories: string[];
}

// GET /api/users/{id}. It is a UserDTO when it has "userInfo".
export type UserProfileResponse = UserDTO | PublicUserProfileDTO;

export interface DeleteUserResponse {
  message: string; // "User deleted successfully"
  success: "true"; // a string, not a boolean
}

// POST /api/users/create. Does not return a token
export interface CreateUserRequest {
  user: {
    categoryIds: number[]; // 1 to 6. Always an array: null responds 500
  };
  userInfo: {
    firstName: string; // max 255
    lastName: string; // max 255
    email: string; // max 254, unique. Sent trimmed
    userName: string; // 3 to 50: letters, numbers, ".", "_", "-". Unique. Sent trimmed
    password: string;
    phone: string; // required, max 20, unique. Sent trimmed
    description: string; // accepts "", max 255
    profilePicture?: string; // URL, max 255
  };
}

// PUT /api/users/update. All optional: only the fields that change are sent
export interface UpdateUserRequest {
  categoryIds?: number[]; // 1 to 6: replaces them all
  firstName?: string;
  lastName?: string;
  email?: string; // if it changes, requires currentPassword
  userName?: string;
  password?: string; // if present, requires currentPassword
  phone?: string;
  description?: string; // "" clears it
  profilePicture?: string; // "" clears it
  currentPassword?: string; // only when email or password change
}
