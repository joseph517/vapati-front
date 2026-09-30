import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProfileFormSectionProps {
  title: string;
  description?: string;
  first?: boolean; // the first section has no top divider
  children: ReactNode;
}

export function ProfileFormSection({
  title,
  description,
  first,
  children,
}: ProfileFormSectionProps) {
  return (
    <section
      className={cn(!first && "mt-[22px] border-t border-[var(--divider)] pt-[22px]")}
    >
      <h2
        className={cn(
          "text-[11.5px] font-medium tracking-[.09em] text-[var(--ink-eyebrow)] uppercase",
          description ? "mb-1" : "mb-3.5"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="mb-3.5 text-[13.5px] text-muted-foreground">
          {description}
        </p>
      )}
      {children}
    </section>
  );
}
