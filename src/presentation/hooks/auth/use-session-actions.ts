import { useAuthStore, type AuthState } from "@/data/auth/session-store";

type SessionActions = Pick<
  AuthState,
  "clearSession" | "setSession" | "updateUserInfo" | "clearBlockedMessage"
>;

// The actions are stable, so reading them from getState() does not subscribe to the store.
export function useSessionActions(): SessionActions {
  return useAuthStore.getState();
}
