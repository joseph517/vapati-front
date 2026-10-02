"use client";

import { useState } from "react";
import { FollowCounterButton } from "@/components/follow-counter-button";
import {
  FOLLOW_LIST_TITLES,
  type FollowAudience,
  type FollowCount,
  type FollowListKind,
} from "@/lib/follow";

interface ProfileFollowStatsProps {
  userId: string;
  audience: FollowAudience;
  followers: FollowCount;
  following: FollowCount;
}

// Followers and following counters. Each one opens its list.
export function ProfileFollowStats({
  followers,
  following,
}: ProfileFollowStatsProps) {
  // The list dialog arrives in step 4 of SPEC 11
  const [, setOpenKind] = useState<FollowListKind | null>(null);

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
    </div>
  );
}
