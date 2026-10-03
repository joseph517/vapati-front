import { STATUS_META } from "@/lib/campaign-status";
import type { CampaignStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: CampaignStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className="inline-flex w-fit items-center rounded-full px-[9px] py-[3px] text-[11px] font-semibold tracking-[.06em] uppercase"
      style={{ backgroundColor: meta.bg, color: meta.fg }}
    >
      {meta.label}
    </span>
  );
}
