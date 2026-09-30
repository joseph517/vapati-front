"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ErrorCard } from "@/components/error-card";
import { ProfileAboutCard } from "@/components/profile-about-card";
import { ProfileHeader } from "@/components/profile-header";
import { ProfileSkeleton } from "@/components/profile-skeleton";
import { useUserProfile } from "@/lib/hooks/use-user-profile";
import { useAuthStore } from "@/lib/store/auth-store";
import { isUserNotFound, toProfileSummary } from "@/lib/user-profile";

export default function PublicProfilePage() {
  const params = useParams<{ userId: string }>();
  const router = useRouter();
  const userInfo = useAuthStore((state) => state.userInfo);

  // The own id goes to /profile without fetching. A non-numeric id is left to the backend (400).
  const isOwnProfile = Number(params.userId) === userInfo?.userId;
  const { profile, loading, error, reload } = useUserProfile(
    isOwnProfile ? null : params.userId
  );

  useEffect(() => {
    if (isOwnProfile) router.replace("/profile");
  }, [isOwnProfile, router]);

  let content: React.ReactNode;
  if (isOwnProfile) {
    content = null;
  } else if (loading) {
    content = <ProfileSkeleton variant="public" />;
  } else if (error && isUserNotFound(error.status)) {
    content = (
      <ErrorCard
        title="No encontramos este usuario"
        message="Puede que no exista o que haya borrado su cuenta."
        actionLabel="Volver a las campañas"
        actionHref="/campaigns"
      />
    );
  } else if (error || !profile) {
    content = (
      <ErrorCard
        title="No pudimos cargar este perfil"
        message={
          error?.message ?? "Ocurrió un error inesperado. Intentá de nuevo."
        }
        actionLabel="Reintentar"
        onAction={reload}
      />
    );
  } else {
    const summary = toProfileSummary(profile);
    content = (
      <>
        <ProfileHeader summary={summary} />
        <ProfileAboutCard
          aboutTitle={`Sobre ${summary.firstName}`}
          description={summary.description}
          categories={summary.categories}
        />
      </>
    );
  }

  return (
    <main className="mx-auto max-w-[760px] px-6 pt-9 pb-20">
      <Link
        href="/campaigns"
        className="mb-6 block text-[13.5px] text-muted-foreground hover:text-foreground"
      >
        ← Todas las campañas
      </Link>
      {content}
    </main>
  );
}
