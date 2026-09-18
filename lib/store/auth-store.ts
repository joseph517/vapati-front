import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UserInfo } from "@/lib/types";

type AuthState = {
  accessToken: string | null;
  userInfo: UserInfo | null;
  hasHydrated: boolean;
  sessionExpired: boolean;
  setSession: (accessToken: string, userInfo: UserInfo) => void;
  clearSession: () => void;
  expireSession: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      userInfo: null,
      hasHydrated: false,
      sessionExpired: false,
      setSession: (accessToken, userInfo) =>
        set({ accessToken, userInfo, sessionExpired: false }),
      clearSession: () =>
        set({ accessToken: null, userInfo: null, sessionExpired: false }),
      expireSession: () =>
        set({ accessToken: null, userInfo: null, sessionExpired: true }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "vapati-auth",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        accessToken: state.accessToken,
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
