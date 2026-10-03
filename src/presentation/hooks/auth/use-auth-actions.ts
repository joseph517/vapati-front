import { authService } from "@/data/auth/auth.service";

// Module-level, so the object and its functions are the same on every render
const authActions = {
  revokeRefreshToken: authService.revokeRefreshToken,
};

export function useAuthActions() {
  return authActions;
}
