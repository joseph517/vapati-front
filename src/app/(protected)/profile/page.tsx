"use client";

import Link from "next/link";
import { useAuthStore } from "@/data/auth/session-store";
import {
  isFullUserProfile,
  toProfileSummary,
} from "@/data/users/user-profile.adapter";
import { UNEXPECTED_ERROR_MESSAGE } from "@/domain/shared/errors";
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
  ProfileFollowStats,
} from "@/presentation/components/organisms/follows/profile-follow-stats";
import {
  DeleteAccountSection,
} from "@/presentation/components/organisms/users/delete-account-section";
import {
  ProfileSkeleton,
} from "@/presentation/components/organisms/users/profile-skeleton";
import { Button } from "@/presentation/components/ui/button";
import {
  useFollowCounts,
} from "@/presentation/hooks/follows/use-follow-counts";
import { useUserProfile } from "@/presentation/hooks/users/use-user-profile";

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
