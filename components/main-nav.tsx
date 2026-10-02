"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsAdmin } from "@/lib/roles";
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

// Only shown to ADMIN. Active on /admin and all its sections.
const ADMIN_LINK: NavLink = {
  href: "/admin",
  label: "Administración",
  isActive: (pathname) => pathname === "/admin" || pathname.startsWith("/admin/"),
};

function NavItem({ link, pathname }: { link: NavLink; pathname: string }) {
  const active = link.isActive(pathname);
  return (
    <Link
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
}

export function MainNav() {
  const pathname = usePathname();
  const isAdmin = useIsAdmin();

  return (
    <nav className="flex flex-wrap items-center gap-[18px]">
      {NAV_LINKS.map((link) => (
        <NavItem key={link.href} link={link} pathname={pathname} />
      ))}
      {isAdmin && (
        <>
          <span aria-hidden="true" className="h-4 w-px bg-border" />
          <NavItem link={ADMIN_LINK} pathname={pathname} />
        </>
      )}
    </nav>
  );
}
