import type { UserInfo, UserRole } from "@/domain/auth/auth.types";

export type AppModule = "campaigns" | "donations" | "users" | "follows" | "admin";

export const MODULE_ROLES: Record<AppModule, readonly UserRole[]> = {
  campaigns: ["USER", "ADMIN"],
  donations: ["USER", "ADMIN"],
  users: ["USER", "ADMIN"],
  follows: ["USER", "ADMIN"],
  admin: ["ADMIN"],
};

// The role is not validated at runtime: an unknown value gets no module.
export function canAccess(module: AppModule, userInfo: UserInfo | null): boolean {
  return userInfo !== null && MODULE_ROLES[module].includes(userInfo.role);
}
