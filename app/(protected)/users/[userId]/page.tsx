"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ErrorCard } from "@/components/error-card";
import { FollowButton } from "@/components/follow-button";
import { NoticeAlert } from "@/components/notice-alert";
import { ProfileAboutCard } from "@/components/profile-about-card";
import { ProfileFollowStats } from "@/components/profile-follow-stats";
import { ProfileHeader } from "@/components/profile-header";
import { ProfileSkeleton } from "@/components/profile-skeleton";
import { UNEXPECTED_ERROR_MESSAGE } from "@/lib/api";
import { useFollowCounts } from "@/lib/hooks/use-follow-counts";
import { useFollowStatus } from "@/lib/hooks/use-follow-status";
import { useUserProfile } from "@/lib/hooks/use-user-profile";
import { useIsAdmin } from "@/lib/roles";
import { useAuthStore } from "@/lib/store/auth-store";
import { isUserNotFound, toProfileSummary } from "@/lib/user-profile";

export default function PublicProfilePage() {
  const params = useParams<{ userId: string }>();
  const router = useRouter();
  const userInfo = useAuthStore((state) => state.userInfo);
  const isAdmin = useIsAdmin();

  // The own id goes to /profile without fetching. A non-numeric id is left to the backend (400).
  const isOwnProfile = Number(params.userId) === userInfo?.userId;
  // The follower counts load in parallel with the profile
  const targetUserId = isOwnProfile ? null : params.userId;
  const { profile, loading, error, reload } = useUserProfile(targetUserId);
  const followCounts = useFollowCounts(targetUserId);
  const followStatus = useFollowStatus(targetUserId, {
    adjust: followCounts.adjustFollowers,
    refetch: followCounts.refetchFollowers,
  });

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
          stats={
            <ProfileFollowStats
              userId={params.userId}
              audience="public"
              followers={followCounts.followers}
              following={followCounts.following}
            />
          }
          action={
            <FollowButton
              status={followStatus.status}
              following={followStatus.following}
              pending={followStatus.pending}
              onToggle={followStatus.toggle}
            />
          }
        />
        {followStatus.error && (
          <NoticeAlert
            tone="danger"
            className="mt-6"
            onDismiss={followStatus.dismissError}
          >
            {followStatus.error}
          </NoticeAlert>
        )}
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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <Link
          href="/campaigns"
          className="text-[13.5px] text-muted-foreground hover:text-foreground"
        >
          ← Todas las campañas
        </Link>
        {isAdmin && profile && !loading && !error && (
          <Link
            href={`/admin/users/${profile.id}`}
            className="text-[13.5px] font-medium text-primary hover:text-[var(--accent-hover)]"
          >
            Ver en administración
          </Link>
        )}
      </div>
      {content}
    </main>
  );
}
