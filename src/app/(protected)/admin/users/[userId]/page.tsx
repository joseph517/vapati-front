"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ErrorCard } from "@/components/error-card";
import { ProfileAboutCard } from "@/components/profile-about-card";
import { ProfileHeader } from "@/components/profile-header";
import { ProfilePrivateDataCard } from "@/components/profile-private-data-card";
import { ProfileSkeleton } from "@/components/profile-skeleton";
import { UserIdPill } from "@/components/user-id-pill";
import { adminUsersBackHref } from "@/lib/admin-users";
import { UNEXPECTED_ERROR_MESSAGE } from "@/lib/api";
import { useUserProfile } from "@/lib/hooks/use-user-profile";
import {
  isFullUserProfile,
  isUserNotFound,
  toProfileSummary,
} from "@/lib/user-profile";

export default function AdminUserDetailPage() {
  return (
    <Suspense fallback={null}>
      <AdminUserDetail />
    </Suspense>
  );
}

function AdminUserDetail() {
  const params = useParams<{ userId: string }>();
  const searchParams = useSearchParams();
  const backHref = adminUsersBackHref(searchParams.get("from"));
  const { profile, loading, error, reload } = useUserProfile(params.userId);

  let content: React.ReactNode;
  if (loading) {
    content = <ProfileSkeleton variant="admin" />;
  } else if (error && isUserNotFound(error.status)) {
    content = (
      <ErrorCard
        title="No encontramos este usuario"
        message="Puede que no exista o que haya borrado su cuenta."
        actionLabel="Volver a Usuarios"
        actionHref={backHref}
      />
    );
  } else if (error || !profile || !isFullUserProfile(profile)) {
    // Without "userInfo" the backend didn't treat the caller as ADMIN.
    content = (
      <ErrorCard
        title="No pudimos cargar este usuario"
        message={error?.message ?? UNEXPECTED_ERROR_MESSAGE}
        actionLabel="Reintentar"
        onAction={reload}
      />
    );
  } else {
    const summary = toProfileSummary(profile);
    content = (
      <>
        <ProfileHeader
          summary={summary}
          headingLevel="h2"
          badge={<UserIdPill id={profile.id} />}
          action={
            <Button asChild variant="outline">
              {/* The admin's own id ends at /profile */}
              <Link href={`/users/${profile.id}`}>Ver perfil público</Link>
            </Button>
          }
        />
        <ProfilePrivateDataCard
          email={profile.userInfo.email}
          phone={profile.userInfo.phone}
          note="El usuario no los muestra en su perfil público."
        />
        <ProfileAboutCard
          aboutTitle={`Sobre ${summary.firstName}`}
          description={summary.description}
          categories={summary.categories}
        />
      </>
    );
  }

  return (
    <div className="max-w-[760px]">
      <Link
        href={backHref}
        className="mb-6 block w-fit text-[13.5px] text-muted-foreground hover:text-foreground"
      >
        ← Volver a Usuarios
      </Link>
      {content}
    </div>
  );
}
