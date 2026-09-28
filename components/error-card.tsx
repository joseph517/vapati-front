import Link from "next/link";

const ACTION_CLASS =
  "mt-4 inline-block rounded-md border border-[var(--accent-soft-border)] bg-white px-3 py-1.5 text-[13px] font-medium text-destructive";

// Renders the action as a button when `onAction` is given, or as a link with `actionHref`.
export function ErrorCard({
  title,
  message,
  actionLabel,
  onAction,
  actionHref,
}: {
  title: string;
  message: string;
  actionLabel: string;
  onAction?: () => void;
  actionHref?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--danger-border)] bg-[var(--danger-bg)] p-6">
      <h2 className="font-serif text-base text-destructive">{title}</h2>
      <p className="mt-1.5 text-[13.5px] text-destructive/90">{message}</p>
      {actionHref ? (
        <Link href={actionHref} className={ACTION_CLASS}>
          {actionLabel}
        </Link>
      ) : (
        <button type="button" onClick={onAction} className={ACTION_CLASS}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
