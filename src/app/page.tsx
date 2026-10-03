"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthHydrated } from "@/presentation/hooks/auth/use-auth-hydrated";
import { useSession } from "@/presentation/hooks/auth/use-session";

export default function Home() {
  const router = useRouter();
  const hasHydrated = useAuthHydrated();
  const accessToken = useSession((state) => state.accessToken);

  useEffect(() => {
    if (!hasHydrated) return;
    router.replace(accessToken ? "/campaigns" : "/login");
  }, [hasHydrated, accessToken, router]);

  return null;
}
