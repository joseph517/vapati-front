import type { ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/presentation/utils/cn";

type NoticeAlertTone = "notice" | "danger";

const TONE_CLASSES: Record<NoticeAlertTone, { box: string; ink: string }> = {
  notice: {
    box: "border-[var(--notice-border)] bg-[var(--notice-bg)]",
    ink: "text-[var(--notice-ink)]",
  },
  danger: {
    box: "border-[var(--danger-border)] bg-[var(--danger-bg)]",
    ink: "text-destructive",
  },
};

// Informational alert with a dot ("notice") or an error alert without it ("danger").
// With `onDismiss` it shows a "×" to close it.
export function NoticeAlert({
  children,
  className,
  onDismiss,
  role,
  tone = "notice",
}: {
  children: ReactNode;
  className?: string;
  onDismiss?: () => void;
  role?: string;
  tone?: NoticeAlertTone;
}) {
  const toneClasses = TONE_CLASSES[tone];

  return (
    <Alert
      role={role ?? "alert"}
      className={cn(toneClasses.box, "text-[13.5px]", className)}
    >
      <AlertDescription
        className={cn(
          "flex items-center gap-2 text-[length:inherit]",
          toneClasses.ink
        )}
      >
        {tone === "notice" && (
          <span className="size-1.5 shrink-0 rounded-full bg-primary" />
        )}
        {onDismiss ? <span className="flex-1">{children}</span> : children}
        {onDismiss && (
          <button
            type="button"
            aria-label="Cerrar aviso"
            onClick={onDismiss}
            className={cn(
              "border-0 bg-transparent text-[18px] leading-none",
              toneClasses.ink
            )}
          >
            ×
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}
