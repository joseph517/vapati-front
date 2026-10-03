import Link from "next/link";
import { TransactionIdPill } from "@/components/transaction-id-pill";
import type { DonationResponseDTO } from "@/domain/donations/donation.types";
import { formatCurrencyCOP, formatDateTime } from "@/lib/utils";

export function MyDonationRow({ donation }: { donation: DonationResponseDTO }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-[18px] px-6 py-5">
      <div className="min-w-0">
        {donation.campaignDeleted ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[15px] font-medium text-muted-foreground">
              {donation.campaignName}
            </span>
            <span className="rounded-full border border-input px-[9px] py-0.5 text-[11.5px] tracking-[.07em] text-[var(--ink-label)] uppercase">
              Campaña eliminada
            </span>
          </div>
        ) : (
          <Link
            href={`/campaigns/${donation.campaignId}`}
            className="text-[15px] font-semibold text-primary hover:text-[var(--accent-hover)] hover:underline"
          >
            {donation.campaignName}
          </Link>
        )}
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          {formatDateTime(donation.createdAt)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1.5">
        <span className="font-serif text-xl font-medium tracking-[-0.01em] text-foreground">
          {formatCurrencyCOP(donation.amount)}
        </span>
        {donation.transactionId && (
          <TransactionIdPill value={donation.transactionId} />
        )}
      </div>
    </div>
  );
}
