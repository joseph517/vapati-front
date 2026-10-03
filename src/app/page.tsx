"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/data/auth/session-store";
import { useAuthHydrated } from "@/presentation/hooks/auth/use-auth-hydrated";

export default function Home() {
  const router = useRouter();
  const hasHydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!hasHydrated) return;
    router.replace(accessToken ? "/campaigns" : "/login");
  }, [hasHydrated, accessToken, router]);

  return null;
}
