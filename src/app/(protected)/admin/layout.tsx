"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSectionTabs } from "@/components/admin-section-tabs";
import { useCanAccess } from "@/presentation/hooks/auth/use-can-access";

// UI-only guard: the real authorization is the backend's @PreAuthorize on the admin endpoints.
// The protected layout already waited for the store to hydrate, so the role is final here.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const canAccessAdmin = useCanAccess("admin");

  useEffect(() => {
    if (!canAccessAdmin) router.replace("/campaigns");
  }, [canAccessAdmin, router]);

  if (!canAccessAdmin) {
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
