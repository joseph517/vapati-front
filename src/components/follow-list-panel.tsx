"use client";

import { DialogClose, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ErrorCard } from "@/components/error-card";
import { FollowListRow } from "@/components/follow-list-row";
import { FollowListSkeleton } from "@/components/follow-list-skeleton";
import { useAuthStore } from "@/data/auth/session-store";
import type {
  FollowAudience,
  FollowListKind,
} from "@/domain/follows/follow.types";
import { UNEXPECTED_ERROR_MESSAGE } from "@/domain/shared/errors";
import { FOLLOW_LIST_EMPTY_TEXTS, FOLLOW_LIST_TITLES } from "@/lib/follow";
import { useFollowList } from "@/lib/hooks/use-follow-list";

interface FollowListPanelProps {
  userId: string;
  audience: FollowAudience;
  kind: FollowListKind;
  onNavigate: () => void; // closes the dialog
}

// Content of the list dialog: title, count, "×" and the loading / error / empty / list states
export function FollowListPanel({
  userId,
  audience,
  kind,
  onNavigate,
}: FollowListPanelProps) {
  const sessionUserId = useAuthStore((state) => state.userInfo?.userId);
  const { status, users, total, error, retry } = useFollowList(userId, kind);

  let body: React.ReactNode;
  if (status === "loading") {
    body = <FollowListSkeleton />;
  } else if (status === "error") {
    body = (
      <ErrorCard
        compact
        message={error ?? UNEXPECTED_ERROR_MESSAGE}
        actionLabel="Reintentar"
        onAction={retry}
      />
    );
  } else if (users.length === 0) {
    body = (
      <p className="rounded-[9px] border-[1.5px] border-dashed border-[var(--border-dashed)] p-5 text-center text-[13.5px] text-muted-foreground">
        {FOLLOW_LIST_EMPTY_TEXTS[audience][kind]}
      </p>
    );
  } else {
    body = (
      <ul className="max-h-[372px] min-h-0 overflow-y-auto">
        {users.map((user) => (
          <li key={user.id}>
            <FollowListRow
              user={user}
              isSessionUser={user.id === sessionUserId}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <DialogHeader className="flex-row items-center justify-between space-y-0">
        <div className="flex items-baseline gap-2">
          <DialogTitle className="font-serif text-2xl font-medium tracking-[-0.01em] text-foreground">
            {FOLLOW_LIST_TITLES[kind]}
          </DialogTitle>
          {status === "ready" && total !== null && (
            <span className="text-sm text-[var(--ink-faint)]">{total}</span>
          )}
        </div>
        <DialogClose asChild>
          <button
            type="button"
            aria-label="Cerrar"
            className="text-xl leading-none text-[var(--ink-faint)] hover:text-foreground"
          >
            ×
          </button>
        </DialogClose>
      </DialogHeader>
      {body}
    </>
  );
}
