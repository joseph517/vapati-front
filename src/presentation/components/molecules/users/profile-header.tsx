import type { ReactNode } from "react";
import type { ProfileSummary } from "@/domain/users/user.types";
import { UserAvatar } from "@/presentation/components/atoms/user-avatar";

interface ProfileHeaderProps {
  summary: ProfileSummary;
  action?: ReactNode;
  stats?: ReactNode; // below the @userName
  badge?: ReactNode; // inline, next to the @userName
  headingLevel?: "h1" | "h2"; // "h2" when the page already has its h1
}

// Avatar, full name and @userName, with optional stats below it and an optional action on the right
export function ProfileHeader({
  summary,
  action,
  stats,
  badge,
  headingLevel: Heading = "h1",
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-wrap items-center gap-[22px]">
      <UserAvatar
        key={summary.profilePicture ?? ""}
        firstName={summary.firstName}
        lastName={summary.lastName}
        src={summary.profilePicture}
      />
      <div className="min-w-0 flex-1">
        <Heading className="font-serif text-[32px] leading-[1.1] font-medium tracking-[-0.015em] text-foreground">
          {summary.firstName} {summary.lastName}
        </Heading>
        {badge ? (
          <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
            <p className="text-sm text-muted-foreground">@{summary.userName}</p>
            {badge}
          </div>
        ) : (
          <p className="mt-1.5 text-sm text-muted-foreground">
            @{summary.userName}
          </p>
        )}
        {stats && <div className="mt-3">{stats}</div>}
      </div>
      {action}
    </div>
  );
}
