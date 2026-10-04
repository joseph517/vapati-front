"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/presentation/utils/cn";

const ADMIN_SECTIONS = [
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/categories", label: "Categorías" },
  { href: "/admin/reports", label: "Reportes" },
];

function isSectionActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSectionTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Secciones de administración"
      className="mt-6 mb-8 flex gap-6 border-b border-border"
    >
      {ADMIN_SECTIONS.map((section) => {
        const active = isSectionActive(pathname, section.href);
        return (
          <Link
            key={section.href}
            href={section.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 border-transparent pb-3 text-sm font-medium text-muted-foreground hover:text-foreground",
              active && "border-primary text-foreground"
            )}
          >
            {section.label}
          </Link>
        );
      })}
    </nav>
  );
}
