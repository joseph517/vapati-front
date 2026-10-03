"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  isFullUserProfile,
  toProfileSummary,
} from "@/data/users/user-profile.adapter";
import { UNEXPECTED_ERROR_MESSAGE } from "@/domain/shared/errors";
import { isUserNotFound } from "@/domain/users/user-profile";
import { UserIdPill } from "@/presentation/components/atoms/user-id-pill";
import { ErrorCard } from "@/presentation/components/molecules/error-card";
import {
  ProfileAboutCard,
} from "@/presentation/components/molecules/users/profile-about-card";
import {
  ProfileHeader,
} from "@/presentation/components/molecules/users/profile-header";
import {
  ProfilePrivateDataCard,
} from "@/presentation/components/molecules/users/profile-private-data-card";
import {
  ProfileSkeleton,
} from "@/presentation/components/organisms/users/profile-skeleton";
import { Button } from "@/presentation/components/ui/button";
import { useUserProfile } from "@/presentation/hooks/users/use-user-profile";
import { adminUsersBackHref } from "@/presentation/utils/admin-routes";

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
