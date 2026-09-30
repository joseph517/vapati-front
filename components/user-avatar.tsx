"use client";

import { useState } from "react";
import { getInitials } from "@/lib/user-profile";

interface UserAvatarProps {
  firstName: string;
  lastName: string;
  src: string | null;
}

// 88px avatar. Falls back to the initials without a photo or when it fails to load.
// The parent renders it with key={src} so a new src resets the load error.
export function UserAvatar({ firstName, lastName, src }: UserAvatarProps) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      // The URL is free-form, and next/image requires declaring its domains.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        onError={() => setFailed(true)}
        className="size-[88px] shrink-0 rounded-full border border-border object-cover"
      />
    );
  }

  return (
    <div
      aria-hidden
      className="flex size-[88px] shrink-0 items-center justify-center rounded-full border border-[var(--accent-soft-border)] bg-accent font-serif text-[32px] font-medium tracking-[-0.01em] text-accent-foreground"
    >
      {getInitials(firstName, lastName)}
    </div>
  );
}
