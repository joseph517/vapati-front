import { useAuthStore } from "@/lib/store/auth-store";
import type { UserInfo } from "@/lib/types";

// The role is not validated at runtime: any value other than "ADMIN" counts as non-admin.
export function isAdmin(userInfo: UserInfo | null): boolean {
  return userInfo?.role === "ADMIN";
}

export function useIsAdmin(): boolean {
  return isAdmin(useAuthStore((s) => s.userInfo));
}
