import Link from "next/link";
import { CategoryChips } from "@/components/category-chips";
import { ProgressBar } from "@/components/progress-bar";
import { StatusBadge } from "@/components/status-badge";
import type { CampaignResponseDTO } from "@/domain/campaigns/campaign.types";
import { formatCurrencyCOP } from "@/lib/utils";

function truncateDescription(text: string): string {
  return text.length > 130 ? `${text.slice(0, 130)}…` : text;
}

export function CampaignCard({ campaign }: { campaign: CampaignResponseDTO }) {
  const pct = Math.min(
    100,
    Math.round((campaign.amountRaised / campaign.amountGoal) * 100)
  );

  return (
    <Link
      href={`/campaigns/${campaign.id}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-[22px] text-left transition-[border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
    >
      <StatusBadge status={campaign.status} />
      <h3 className="mt-3 font-serif text-xl leading-[1.25] tracking-[-0.01em] text-foreground">
        {campaign.name}
      </h3>
      <p className="mt-2 text-[13.5px] leading-[1.55] text-muted-foreground">
        {truncateDescription(campaign.description)}
      </p>
      <div className="mt-3.5 mb-1">
        <CategoryChips categories={campaign.categories} />
      </div>
      <div className="mt-2 flex-1" />
      <ProgressBar value={pct} className="h-[7px]" />
      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          {formatCurrencyCOP(campaign.amountRaised)}
        </span>
        <span className="text-[12.5px] text-[var(--ink-label)]">
          {pct}% de {formatCurrencyCOP(campaign.amountGoal)}
        </span>
      </div>
    </Link>
  );
}
