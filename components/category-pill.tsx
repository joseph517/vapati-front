import type { ReactNode } from "react";

interface CategoryPillProps {
  children: ReactNode;
}

// Read-only category chip
export function CategoryPill({ children }: CategoryPillProps) {
  return (
    <span className="rounded-full border border-input bg-white px-3.5 py-2 text-[13px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}
