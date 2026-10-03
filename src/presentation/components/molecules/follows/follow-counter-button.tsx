import type { FollowCount } from "@/domain/follows/follow.types";
import { Skeleton } from "@/presentation/components/ui/skeleton";

interface FollowCounterButtonProps {
  label: string;
  count: FollowCount;
  onClick: () => void;
}

// "N Seguidores": opens its list, also when the count failed ("—")
export function FollowCounterButton({
  label,
  count,
  onClick,
}: FollowCounterButtonProps) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={onClick}
      className="group inline-flex cursor-pointer items-center gap-1 text-sm"
    >
      {count.status === "loading" ? (
        <Skeleton className="h-3.5 w-5 rounded-sm" />
      ) : count.status === "error" ? (
        <span className="font-semibold text-[var(--ink-faint)]">—</span>
      ) : (
        <span className="font-semibold text-foreground">{count.value}</span>
      )}
      <span className="text-muted-foreground transition-colors group-hover:text-foreground">
        {label}
      </span>
    </button>
  );
}
