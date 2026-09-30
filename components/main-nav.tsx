"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavLink = {
  href: string;
  label: string;
  isActive: (pathname: string) => boolean;
};

const NAV_LINKS: NavLink[] = [
  {
    href: "/campaigns",
    label: "Campañas",
    // Also active on a campaign's detail and edit pages, and on a public profile.
    isActive: (pathname) =>
      pathname === "/campaigns" ||
      (pathname.startsWith("/campaigns/") &&
        pathname !== "/campaigns/mine" &&
        pathname !== "/campaigns/new") ||
      pathname.startsWith("/users/"),
  },
  {
    href: "/campaigns/mine",
    label: "Mis campañas",
    isActive: (pathname) => pathname === "/campaigns/mine",
  },
  {
    href: "/campaigns/new",
    label: "Crear campaña",
    isActive: (pathname) => pathname === "/campaigns/new",
  },
  {
    href: "/my-donations",
    label: "Mis donaciones",
    isActive: (pathname) => pathname === "/my-donations",
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-[18px]">
      {NAV_LINKS.map((link) => {
        const active = link.isActive(pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "text-sm font-medium text-muted-foreground hover:text-foreground",
              active && "text-foreground"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
