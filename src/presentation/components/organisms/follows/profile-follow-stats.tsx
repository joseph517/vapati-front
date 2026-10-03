"use client";

import { useState } from "react";
import type {
  FollowAudience,
  FollowCount,
  FollowListKind,
} from "@/domain/follows/follow.types";
import {
  FollowCounterButton,
} from "@/presentation/components/molecules/follows/follow-counter-button";
import {
  FollowListDialog,
} from "@/presentation/components/organisms/follows/follow-list-dialog";
import { FOLLOW_LIST_TITLES } from "@/presentation/utils/follow-texts";

interface ProfileFollowStatsProps {
  userId: string;
  audience: FollowAudience;
  followers: FollowCount;
  following: FollowCount;
}

// Followers and following counters. Each one opens its list in a dialog.
export function ProfileFollowStats({
  userId,
  audience,
  followers,
  following,
}: ProfileFollowStatsProps) {
  const [openKind, setOpenKind] = useState<FollowListKind | null>(null);

  return (
    <div className="flex flex-wrap gap-[18px]">
      <FollowCounterButton
        label={FOLLOW_LIST_TITLES.followers}
        count={followers}
        onClick={() => setOpenKind("followers")}
      />
      <FollowCounterButton
        label={FOLLOW_LIST_TITLES.following}
        count={following}
        onClick={() => setOpenKind("following")}
      />
      <FollowListDialog
        userId={userId}
        audience={audience}
        kind={openKind}
        onClose={() => setOpenKind(null)}
      />
    </div>
  );
}
