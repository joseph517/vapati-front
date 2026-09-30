"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { HeaderProfileLink } from "@/components/header-profile-link";
import { LogoutButton } from "@/components/logout-button";
import { MainNav } from "@/components/main-nav";
import { useAuthHydrated, useAuthStore } from "@/lib/store/auth-store";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const hasHydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionExpired = useAuthStore((state) => state.sessionExpired);
  const logoutRedirect = useAuthStore((state) => state.logoutRedirect);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!accessToken) {
      router.replace(
        sessionExpired
          ? "/login?flash=session-expired"
          : (logoutRedirect ?? "/login")
      );
    }
  }, [hasHydrated, accessToken, sessionExpired, logoutRedirect, router]);

  if (!hasHydrated || !accessToken) {
    return null;
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-card">
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center gap-5 px-6 py-3.5">
          <Link
            href="/campaigns"
            className="font-serif text-[22px] font-medium tracking-[-0.01em] text-foreground"
          >
            VaPaTi
          </Link>
          <MainNav />
          <div className="ml-auto flex items-center gap-4">
            <HeaderProfileLink />
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
