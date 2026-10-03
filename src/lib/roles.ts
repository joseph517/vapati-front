import type { UserInfo } from "@/domain/auth/auth.types";
import { useAuthStore } from "@/lib/store/auth-store";

// The role is not validated at runtime: any value other than "ADMIN" counts as non-admin.
export function isAdmin(userInfo: UserInfo | null): boolean {
  return userInfo?.role === "ADMIN";
}

export function useIsAdmin(): boolean {
  return isAdmin(useAuthStore((s) => s.userInfo));
}
