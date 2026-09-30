export type CampaignStatus = "ACTIVE" | "COMPLETED" | "CLOSED";

export type CampaignStatusHistoryResponseDTO = {
  previousStatus: CampaignStatus | null;
  newStatus: CampaignStatus;
  changedByUserId: number | null; // null for automatic transitions
  changedAt: string; // ISO datetime
};

export type CampaignResponseDTO = {
  id: number;
  name: string;
  description: string;
  amountGoal: number;
  amountRaised: number;
  userId: number;
  userName: string;
  categories: CategoryDTO[];
  status: CampaignStatus;
};

export type UserInfo = {
  userId: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  userName: string;
  fullName: string;
};

export type AuthResponse = {
  accessToken: string; // 1 hour. Sent as Authorization: Bearer
  refreshToken: string; // 7 days. Only for refresh and logout
  userInfo: UserInfo;
};

export type ApiError = {
  error: string;
  message: string;
  timestamp: string;
  fields?: Record<string, string>; // only when error === "Validation failed"
  path?: string; // only on the unauthenticated 401 and the blocked-account 403
};

export type DonationStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"; // only COMPLETED today

export type DonationResponseDTO = {
  id: number;
  donorUserId: number | null; // null if the donor deleted their account
  donorUserName: string | null; // null if the donor deleted their account
  campaignId: number;
  campaignName: string; // also for a deleted campaign
  campaignDeleted: boolean; // true only in my-donations, when the campaign was deleted
  amount: number; // DECIMAL(15,2)
  status: DonationStatus;
  transactionId: string | null; // "TXN-XXXXXXXX". null if the caller can't see it
  createdAt: string; // ISO LocalDateTime without zone, server time
  updatedAt: string;
};

export type CreateDonationRequest = {
  campaignId: number;
  amount: number; // > 0, up to 13 integer digits and 2 decimals
};

export type CreateDonationResponse = {
  message: string;
  donation: DonationResponseDTO;
  status: "COMPLETED";
};

// my-donations and a campaign's donations
export type DonationListResponse = {
  message: string;
  donations: DonationResponseDTO[]; // newest first
  total: number;
};

export type CampaignStatisticsDTO = {
  campaignId: number;
  campaignName: string;
  amountGoal: number;
  amountRaised: number;
  percentageReached: number; // 2 decimals, can exceed 100
  isGoalReached: boolean;
  status: CampaignStatus;
  totalDonors: number;
  averageDonation: number; // 2 decimals. 0 without donations
  totalDonations: number;
};

export type CampaignStatisticsResponse = {
  message: string;
  statistics: CampaignStatisticsDTO;
};

export type CategoryDTO = {
  id: number;
  name: string;
  description: string;
};

export type CreateCampaignRequest = {
  name: string;
  description: string;
  amountGoal: number;
  categoryIds: number[];
};

export type CreateCampaignResponse = {
  message: string;
  campaignId: number;
  status: "CREATED"; // not a CampaignStatus
};

export type UpdateCampaignRequest = {
  name?: string;
  description?: string;
  amountGoal?: number;
  categoryIds: number[]; // always sent, 1 to 5: replaces all of them
};

export type MyCampaignsResponse = {
  message: string;
  campaigns: CampaignResponseDTO[];
  total: number;
};

export type DeleteCampaignResponse = {
  message: string;
  campaignId: number;
};

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

// Full profile: only for the user's own id
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
