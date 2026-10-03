import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthResponse, UserInfo } from "@/domain/auth/auth.types";

export const DEFAULT_LOGOUT_REDIRECT = "/login?flash=logged-out";

export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  userInfo: UserInfo | null;
  blockedMessage: string | null;
  hasHydrated: boolean;
  sessionExpired: boolean;
  logoutRedirect: string | null; // where the protected layout goes after clearSession. Not persisted
  setSession: (auth: AuthResponse) => void;
  clearSession: (redirectTo?: string) => void;
  expireSession: () => void;
  blockSession: (message: string) => void;
  clearBlockedMessage: () => void;
  // Merges into the current userInfo and recomputes fullName. Does nothing without a userInfo.
  updateUserInfo: (partial: Partial<Omit<UserInfo, "fullName">>) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userInfo: null,
      blockedMessage: null,
      hasHydrated: false,
      sessionExpired: false,
      logoutRedirect: null,
      setSession: ({ accessToken, refreshToken, userInfo }) =>
        set({
          accessToken,
          refreshToken,
          userInfo,
          sessionExpired: false,
          logoutRedirect: null,
          blockedMessage: null,
        }),
      clearSession: (redirectTo = DEFAULT_LOGOUT_REDIRECT) =>
        set({
          accessToken: null,
          refreshToken: null,
          userInfo: null,
          sessionExpired: false,
          logoutRedirect: redirectTo,
          blockedMessage: null,
        }),
      expireSession: () =>
        set({
          accessToken: null,
          refreshToken: null,
          userInfo: null,
          sessionExpired: true,
          logoutRedirect: null,
        }),
      blockSession: (message) =>
        set({
          accessToken: null,
          refreshToken: null,
          userInfo: null,
          sessionExpired: false,
          logoutRedirect: null,
          blockedMessage: message,
        }),
      clearBlockedMessage: () => set({ blockedMessage: null }),
      updateUserInfo: (partial) =>
        set((state) => {
          if (!state.userInfo) return {};
          const userInfo = { ...state.userInfo, ...partial };
          return {
            userInfo: {
              ...userInfo,
              fullName: `${userInfo.firstName} ${userInfo.lastName}`,
            },
          };
        }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "vapati-auth",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        userInfo: state.userInfo,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// Read at call time, so services always send the current token.
export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}

// apiFetch options for an authenticated request. Without a token it goes out as public,
// as it did when callers passed the store's accessToken.
export function auth(): { accessToken: string | null } {
  return { accessToken: getAccessToken() };
}
