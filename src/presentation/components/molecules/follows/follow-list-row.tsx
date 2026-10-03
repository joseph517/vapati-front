import Link from "next/link";
import type { FollowerUserDTO } from "@/domain/follows/follow.types";
import { UserAvatar } from "@/presentation/components/atoms/user-avatar";
import { followerProfileHref } from "@/presentation/utils/follow-texts";
import { formatDate } from "@/presentation/utils/format";

interface FollowListRowProps {
  user: FollowerUserDTO;
  isSessionUser: boolean;
  onNavigate: () => void; // closes the dialog
}

// One user of the followers / following list. Links to their profile.
export function FollowListRow({
  user,
  isSessionUser,
  onNavigate,
}: FollowListRowProps) {
  // The session user's own row goes to /profile
  const href = followerProfileHref(
    user.id,
    isSessionUser ? user.id : undefined
  );

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3.5 rounded-[9px] p-2.5 transition-colors hover:bg-[var(--track-soft)]"
    >
      <UserAvatar
        key={user.profilePicture ?? ""}
        firstName={user.firstName}
        lastName={user.lastName}
        src={user.profilePicture}
        size="md"
      />
      <div className="min-w-0">
        <p className="flex min-w-0 items-baseline gap-1.5">
          <span className="truncate text-[15px] font-medium text-foreground">
            {user.firstName} {user.lastName}
          </span>
          {isSessionUser && (
            <span className="shrink-0 text-[12.5px] text-[var(--ink-faint)]">
              (vos)
            </span>
          )}
        </p>
        <p className="truncate text-[13.5px] text-muted-foreground">
          @{user.userName}
        </p>
      </div>
      <span className="text-[12.5px] whitespace-nowrap text-[var(--ink-faint)]">
        Desde {formatDate(user.followedAt)}
      </span>
    </Link>
  );
}
