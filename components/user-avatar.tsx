"use client";

import { useState } from "react";
import { getInitials } from "@/lib/user-profile";
import { cn } from "@/lib/utils";

type UserAvatarSize = "lg" | "sm";

interface UserAvatarProps {
  firstName: string;
  lastName: string;
  src: string | null;
  size?: UserAvatarSize;
}

// lg: 88px (profile header). sm: 32px (photo preview in edit profile).
const SIZE_CLASSES: Record<UserAvatarSize, { box: string; initials: string }> = {
  lg: { box: "size-[88px]", initials: "text-[32px]" },
  sm: { box: "size-8", initials: "text-[13px]" },
};

// Falls back to the initials without a photo or when it fails to load.
// The parent renders it with key={src} so a new src resets the load error.
export function UserAvatar({
  firstName,
  lastName,
  src,
  size = "lg",
}: UserAvatarProps) {
  const [failed, setFailed] = useState(false);
  const sizeClasses = SIZE_CLASSES[size];

  if (src && !failed) {
    return (
      // The URL is free-form, and next/image requires declaring its domains.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        onError={() => setFailed(true)}
        className={cn(
          "shrink-0 rounded-full border border-border object-cover",
          sizeClasses.box
        )}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border border-[var(--accent-soft-border)] bg-accent font-serif font-medium tracking-[-0.01em] text-accent-foreground",
        sizeClasses.box,
        sizeClasses.initials
      )}
    >
      {getInitials(firstName, lastName)}
    </div>
  );
}
