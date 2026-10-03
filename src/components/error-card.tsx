import Link from "next/link";
import { cn } from "@/presentation/utils/cn";

const ACTION_CLASS =
  "inline-block rounded-md border border-[var(--accent-soft-border)] bg-white px-3 py-1.5 text-[13px] font-medium text-destructive";

// Renders the action as a button when `onAction` is given, or as a link with `actionHref`.
// `compact` is the smaller variant used inside dialogs.
export function ErrorCard({
  title,
  message,
  actionLabel,
  onAction,
  actionHref,
  compact = false,
}: {
  title?: string;
  message: string;
  actionLabel: string;
  onAction?: () => void;
  actionHref?: string;
  compact?: boolean;
}) {
  const actionClass = cn(ACTION_CLASS, compact ? "mt-2.5" : "mt-4");

  return (
    <div
      className={cn(
        "border border-[var(--danger-border)] bg-[var(--danger-bg)]",
        compact ? "rounded-lg px-3.5 py-3" : "rounded-xl p-6"
      )}
    >
      {title && (
        <h2 className="font-serif text-base text-destructive">{title}</h2>
      )}
      <p
        className={cn("text-[13.5px] text-destructive/90", title && "mt-1.5")}
      >
        {message}
      </p>
      {actionHref ? (
        <Link href={actionHref} className={actionClass}>
          {actionLabel}
        </Link>
      ) : (
        <button type="button" onClick={onAction} className={actionClass}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
