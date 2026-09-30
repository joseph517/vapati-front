import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthResponse, UserInfo } from "@/lib/types";

export const DEFAULT_LOGOUT_REDIRECT = "/login?flash=logged-out";

type AuthState = {
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

export function useAuthHydrated() {
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  return useAuthStore((state) => state.hasHydrated);
}
