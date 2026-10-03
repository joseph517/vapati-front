"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSectionTabs } from "@/components/admin-section-tabs";
import { useIsAdmin } from "@/lib/roles";

// UI-only guard: the real authorization is the backend's @PreAuthorize on the admin endpoints.
// The protected layout already waited for the store to hydrate, so the role is final here.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (!isAdmin) router.replace("/campaigns");
  }, [isAdmin, router]);

  if (!isAdmin) {
    return null;
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6 pt-11 pb-20">
      <h1 className="font-serif text-[32px] leading-[1.1] font-medium tracking-[-0.015em] text-foreground">
        Administración
      </h1>
      <AdminSectionTabs />
      {children}
    </main>
  );
}
