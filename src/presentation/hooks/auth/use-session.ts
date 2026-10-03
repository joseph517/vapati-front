import { useAuthStore, type AuthState } from "@/data/auth/session-store";

// Reactive read of the session, same signature as useAuthStore(selector).
export function useSession<T>(selector: (state: AuthState) => T): T {
  return useAuthStore(selector);
}
