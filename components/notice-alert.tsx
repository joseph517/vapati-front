import type { ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

// Informational alert with a dot. With `onDismiss` it shows a "×" to close it.
export function NoticeAlert({
  children,
  className,
  onDismiss,
  role,
}: {
  children: ReactNode;
  className?: string;
  onDismiss?: () => void;
  role?: string;
}) {
  return (
    <Alert
      role={role ?? "alert"}
      className={cn(
        "border-[var(--notice-border)] bg-[var(--notice-bg)] text-[13.5px]",
        className
      )}
    >
      <AlertDescription className="flex items-center gap-2 text-[length:inherit] text-[var(--notice-ink)]">
        <span className="size-1.5 shrink-0 rounded-full bg-primary" />
        {onDismiss ? <span className="flex-1">{children}</span> : children}
        {onDismiss && (
          <button
            type="button"
            aria-label="Cerrar aviso"
            onClick={onDismiss}
            className="border-0 bg-transparent text-[18px] leading-none text-[var(--notice-ink)]"
          >
            ×
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}
