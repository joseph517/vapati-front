"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/data/auth/session-store";
import { useAuthHydrated } from "@/presentation/hooks/auth/use-auth-hydrated";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const hasHydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!hasHydrated) return;
    if (accessToken) {
      router.replace("/campaigns");
    }
  }, [hasHydrated, accessToken, router]);

  if (!hasHydrated || accessToken) {
    return null;
  }

  return <>{children}</>;
}
