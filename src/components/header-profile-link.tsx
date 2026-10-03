"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/data/auth/session-store";

// The user's name in the header, as the link to "Mi perfil"
export function HeaderProfileLink() {
  const pathname = usePathname();
  const fullName = useAuthStore((state) => state.userInfo?.fullName);

  const active = pathname === "/profile" || pathname.startsWith("/profile/");

  if (active) {
    return (
      <Link
        href="/profile"
        aria-current="page"
        className="text-[13px] font-medium text-foreground no-underline"
      >
        {fullName}
      </Link>
    );
  }

  return (
    <Link
      href="/profile"
      title="Mi perfil"
      className="text-[13px] text-muted-foreground underline decoration-[var(--border-dashed)] underline-offset-[3px] hover:text-foreground hover:decoration-[var(--border-strong)]"
    >
      {fullName}
    </Link>
  );
}
