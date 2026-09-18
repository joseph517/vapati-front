export type CampaignResponseDTO = {
  id: number;
  name: string;
  description: string;
  amountGoal: number;
  amountRaised: number;
  userId: number;
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

export type ApiError = {
  error: string;
  message: string;
  timestamp: string;
};

export type DonationResponseDTO = {
  id: number;
  donorUserId: number;
  donorUserName: string;
  campaignId: number;
  campaignName: string;
  amount: number;
  status: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
};

export const INTEREST_CATEGORIES = [
  { id: 1, label: "Educación" },
  { id: 2, label: "Salud" },
  { id: 3, label: "Medio ambiente" },
  { id: 4, label: "Vivienda" },
  { id: 5, label: "Animales" },
  { id: 6, label: "Cultura" },
] as const;
