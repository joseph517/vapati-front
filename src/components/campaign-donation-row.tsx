import { TransactionIdPill } from "@/components/transaction-id-pill";
import type { DonationResponseDTO } from "@/domain/donations/donation.types";
import { ANONYMOUS_DONOR_LABEL } from "@/lib/donations";
import { formatCurrencyCOP, formatDateTime } from "@/lib/utils";

export function CampaignDonationRow({
  donation,
}: {
  donation: DonationResponseDTO;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 py-3.5">
      <div className="min-w-0">
        {donation.donorUserName === null ? (
          <p className="text-[15px] font-medium text-muted-foreground">
            {ANONYMOUS_DONOR_LABEL}
          </p>
        ) : (
          <p className="text-[15px] font-medium text-foreground">
            {donation.donorUserName}
          </p>
        )}
        <p className="mt-0.5 text-[12.5px] text-[var(--ink-faint)]">
          {formatDateTime(donation.createdAt)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1.5">
        <span className="text-[15px] font-semibold text-foreground">
          {formatCurrencyCOP(donation.amount)}
        </span>
        {donation.transactionId !== null && (
          <TransactionIdPill value={donation.transactionId} />
        )}
      </div>
    </div>
  );
}
