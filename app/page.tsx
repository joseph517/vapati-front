"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthHydrated, useAuthStore } from "@/lib/store/auth-store";

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
