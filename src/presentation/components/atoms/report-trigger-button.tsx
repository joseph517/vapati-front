import type { ReactNode } from "react";
import { cn } from "@/presentation/utils/cn";

// Underlined text button that opens the report dialog. `className` sets the size.
export function ReportTriggerButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={onClick}
      className={cn(
        "border-0 bg-transparent p-0 text-[var(--ink-faint)] underline decoration-[#dcd0c0] underline-offset-[3px] transition-colors hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}
