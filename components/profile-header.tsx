import type { ReactNode } from "react";
import { UserAvatar } from "@/components/user-avatar";
import type { ProfileSummary } from "@/lib/user-profile";

interface ProfileHeaderProps {
  summary: ProfileSummary;
  action?: ReactNode;
  stats?: ReactNode; // below the @userName
}

// Avatar, full name and @userName, with optional stats below it and an optional action on the right
export function ProfileHeader({ summary, action, stats }: ProfileHeaderProps) {
  return (
    <div className="flex flex-wrap items-center gap-[22px]">
      <UserAvatar
        key={summary.profilePicture ?? ""}
        firstName={summary.firstName}
        lastName={summary.lastName}
        src={summary.profilePicture}
      />
      <div className="min-w-0 flex-1">
        <h1 className="font-serif text-[32px] leading-[1.1] font-medium tracking-[-0.015em] text-foreground">
          {summary.firstName} {summary.lastName}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          @{summary.userName}
        </p>
        {stats && <div className="mt-3">{stats}</div>}
      </div>
      {action}
    </div>
  );
}
