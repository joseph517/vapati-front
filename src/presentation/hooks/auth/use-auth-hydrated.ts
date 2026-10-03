import { useEffect } from "react";
import { useAuthStore } from "@/data/auth/session-store";

export function useAuthHydrated() {
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  return useAuthStore((state) => state.hasHydrated);
}
