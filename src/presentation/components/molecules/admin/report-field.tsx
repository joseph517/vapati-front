import type { ReactNode } from "react";
import { cn } from "@/presentation/utils/cn";

// Uppercase label over its content, used by the report and review cards
export function ReportField({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[11.5px] leading-none font-medium tracking-[.07em] text-[var(--ink-label)] uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}
