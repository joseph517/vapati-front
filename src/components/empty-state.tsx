import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[var(--border-dashed)] px-6 py-[60px] text-center">
      <h2 className="font-serif text-lg text-foreground">{title}</h2>
      {description && (
        <p className="max-w-[380px] text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
