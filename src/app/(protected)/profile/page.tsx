"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DeleteAccountSection } from "@/components/delete-account-section";
import { ErrorCard } from "@/components/error-card";
import { ProfileAboutCard } from "@/components/profile-about-card";
import { ProfileFollowStats } from "@/components/profile-follow-stats";
import { ProfileHeader } from "@/components/profile-header";
import { ProfilePrivateDataCard } from "@/components/profile-private-data-card";
import { ProfileSkeleton } from "@/components/profile-skeleton";
import { useAuthStore } from "@/data/auth/session-store";
import {
  isFullUserProfile,
  toProfileSummary,
} from "@/data/users/user-profile.adapter";
import { UNEXPECTED_ERROR_MESSAGE } from "@/domain/shared/errors";
import { useFollowCounts } from "@/lib/hooks/use-follow-counts";
import { useUserProfile } from "@/lib/hooks/use-user-profile";

export default function ProfilePage() {
  // The protected layout guarantees the session.
  const userInfo = useAuthStore((state) => state.userInfo);
  const userId = userInfo ? String(userInfo.userId) : null;
  const { profile, loading, error, reload } = useUserProfile(userId);
  const followCounts = useFollowCounts(userId);

  let content: React.ReactNode;
  if (loading) {
    content = <ProfileSkeleton variant="own" />;
  } else if (error || !profile || !isFullUserProfile(profile)) {
    // Without "userInfo" the backend didn't send the own profile.
    content = (
      <ErrorCard
        title="No pudimos cargar tu perfil"
        message={error?.message ?? UNEXPECTED_ERROR_MESSAGE}
        actionLabel="Reintentar"
        onAction={reload}
      />
    );
  } else {
    content = (
      <>
        <ProfileHeader
          summary={toProfileSummary(profile)}
          stats={
            <ProfileFollowStats
              userId={String(profile.id)}
              audience="own"
              followers={followCounts.followers}
              following={followCounts.following}
            />
          }
          action={
            <Button asChild variant="outline">
              <Link href="/profile/edit">Editar perfil</Link>
            </Button>
          }
        />
        <ProfileAboutCard
          aboutTitle="Sobre vos"
          description={profile.userInfo.description}
          categories={profile.categories}
        />
        <ProfilePrivateDataCard
          email={profile.userInfo.email}
          phone={profile.userInfo.phone}
        />
        <DeleteAccountSection />
      </>
    );
  }

  return (
    <main className="mx-auto max-w-[760px] px-6 pt-11 pb-20">{content}</main>
  );
}
