"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/data/auth/session-store";
import { isFullUserProfile } from "@/data/users/user-profile.adapter";
import { usersService } from "@/data/users/users.service";
import { UNEXPECTED_ERROR_MESSAGE } from "@/domain/shared/errors";
import type { CredentialsChange } from "@/domain/users/profile-form";
import type { UpdateUserRequest } from "@/domain/users/user.types";
import { ErrorCard } from "@/presentation/components/molecules/error-card";
import {
  ProfileEditForm,
} from "@/presentation/components/organisms/users/profile-edit-form";
import {
  ProfileEditSkeleton,
} from "@/presentation/components/organisms/users/profile-edit-skeleton";
import { useCategories } from "@/presentation/hooks/categories/use-categories";
import { useUserProfile } from "@/presentation/hooks/users/use-user-profile";
import { cn } from "@/presentation/utils/cn";

export default function EditProfilePage() {
  const router = useRouter();
  // The protected layout guarantees the session.
  const userInfo = useAuthStore((state) => state.userInfo);
  const clearSession = useAuthStore((state) => state.clearSession);
  const updateUserInfo = useAuthStore((state) => state.updateUserInfo);

  // Profile and categories load in parallel: the form maps category names to ids.
  const profileState = useUserProfile(userInfo ? String(userInfo.userId) : null);
  const categoriesState = useCategories();

  const [saving, setSaving] = useState(false);

  function reloadAll() {
    profileState.reload();
    categoriesState.reload();
  }

  // Keeps `saving` on after a successful PUT until the navigation happens.
  async function saveProfile(
    request: UpdateUserRequest,
    change: CredentialsChange
  ) {
    setSaving(true);
    try {
      const updated = await usersService.update(request);
      if (change !== null) {
        // The tokens are no longer valid, so /auth/logout is not called.
        // The protected layout redirects to the login with the notice.
        clearSession(
          `/login?flash=credentials-changed&email=${encodeURIComponent(updated.userInfo.email)}`
        );
        return;
      }
      const { firstName, lastName, userName, email } = updated.userInfo;
      updateUserInfo({ firstName, lastName, userName, email });
      router.push("/profile");
    } catch (error) {
      setSaving(false);
      throw error;
    }
  }

  const loading = profileState.loading || categoriesState.loading;
  const loadErrorMessage =
    profileState.error?.message ?? categoriesState.error;
  // Without "userInfo" the backend didn't send the own profile.
  const profile =
    profileState.profile && isFullUserProfile(profileState.profile)
      ? profileState.profile
      : null;
  const ready = !loading && !loadErrorMessage && profile !== null;

  let content: React.ReactNode;
  if (loading) {
    content = <ProfileEditSkeleton />;
  } else if (loadErrorMessage || !profile) {
    content = (
      <ErrorCard
        title="No pudimos cargar tu perfil"
        message={loadErrorMessage ?? UNEXPECTED_ERROR_MESSAGE}
        actionLabel="Reintentar"
        onAction={reloadAll}
      />
    );
  } else {
    content = (
      <>
        <p className="mt-2 mb-7 text-sm text-muted-foreground">
          @{profile.userInfo.userName}
        </p>
        <ProfileEditForm
          user={profile}
          categories={categoriesState.categories}
          onSubmit={saveProfile}
        />
      </>
    );
  }

  return (
    <main className="mx-auto flex max-w-[620px] flex-col px-6 pt-11 pb-20">
      <Link
        href="/profile"
        aria-disabled={saving || undefined}
        tabIndex={saving ? -1 : undefined}
        className={cn(
          "mb-4 text-[13.5px] text-muted-foreground hover:text-foreground",
          saving && "pointer-events-none opacity-50"
        )}
      >
        ← Volver a Mi perfil
      </Link>
      <h1
        className={cn(
          "font-serif text-[32px] leading-[1.1] font-medium tracking-[-0.015em] text-foreground",
          !ready && "mb-7"
        )}
      >
        Editar perfil
      </h1>
      {content}
    </main>
  );
}
