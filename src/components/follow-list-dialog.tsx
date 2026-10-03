"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FollowListPanel } from "@/components/follow-list-panel";
import type {
  FollowAudience,
  FollowListKind,
} from "@/domain/follows/follow.types";

interface FollowListDialogProps {
  userId: string;
  audience: FollowAudience;
  kind: FollowListKind | null; // null = closed
  onClose: () => void;
}

// Followers / following list. Anchored 120px from the top so it doesn't jump
// when the skeleton turns into rows.
export function FollowListDialog({
  userId,
  audience,
  kind,
  onClose,
}: FollowListDialogProps) {
  // Keeps the last list while the closing animation runs. DialogContent unmounts
  // once closed, so the panel mounts (and fetches) again on every opening.
  const [shownKind, setShownKind] = useState(kind);
  if (kind !== null && kind !== shownKind) {
    setShownKind(kind);
  }

  return (
    <Dialog
      open={kind !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="top-[120px] flex max-h-[calc(100dvh-136px)] w-[calc(100%-2rem)] max-w-[440px] translate-y-0 flex-col gap-4 rounded-[14px] border border-input bg-card p-[26px] shadow-[0_24px_60px_rgba(38,32,27,0.22)] sm:max-w-[440px]"
      >
        {shownKind && (
          <FollowListPanel
            key={shownKind}
            userId={userId}
            audience={audience}
            kind={shownKind}
            onNavigate={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
