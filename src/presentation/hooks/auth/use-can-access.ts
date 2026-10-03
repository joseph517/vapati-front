import { useAuthStore } from "@/data/auth/session-store";
import { canAccess, type AppModule } from "@/domain/auth/permissions";

export function useCanAccess(module: AppModule): boolean {
  return canAccess(module, useAuthStore((s) => s.userInfo));
}
