import { Button } from "@/components/ui/button";
import type { LoadStatus } from "@/lib/follow";

interface FollowButtonProps {
  status: LoadStatus; // of is-following
  following: boolean;
  pending: boolean;
  onToggle: () => void;
}

// "Seguir" / "Dejar de seguir". Disabled until is-following responds, hidden if it failed.
export function FollowButton({
  status,
  following,
  pending,
  onToggle,
}: FollowButtonProps) {
  if (status === "error") return null;

  return (
    <Button
      type="button"
      variant={following ? "outline" : "default"}
      disabled={status === "loading" || pending}
      onClick={onToggle}
      className={following ? "h-8 px-3.5" : "h-8 px-3.5 font-semibold"}
    >
      {following ? "Dejar de seguir" : "Seguir"}
      {pending && (
        <span className="text-[13px] font-normal opacity-85">procesando…</span>
      )}
    </Button>
  );
}
