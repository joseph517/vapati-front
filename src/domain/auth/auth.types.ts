export type UserRole = "USER" | "ADMIN";

export type UserInfo = {
  userId: number;
  email: string;
  role: UserRole;
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
