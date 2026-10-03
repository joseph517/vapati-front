import type { ReactNode } from "react";
import type { DonationReceipt } from "@/domain/donations/donation.types";
import { formatCurrencyCOP } from "@/presentation/utils/format";

// Confirmation shown on the campaign detail right after a donation.
export function DonationReceiptCard({ receipt }: { receipt: DonationReceipt }) {
  return (
    <div className="mb-[26px] rounded-xl border border-[var(--success-border)] bg-[var(--success-bg)] px-[22px] py-5">
      <div className="flex items-center gap-2">
        <span className="size-2 shrink-0 rounded-full bg-[var(--success)]" />
        <h2 className="font-serif text-[17px] font-medium text-[var(--success-ink)]">
          {receipt.message}
        </h2>
      </div>
      <p className="mt-1.5 text-[13.5px] text-[var(--success-ink-soft)]">
        Tu aporte de {formatCurrencyCOP(receipt.amount)} quedó aprobado al
        instante. Gracias.
      </p>
      <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs text-[var(--success-ink)]">
        <ReceiptPill>{receipt.status}</ReceiptPill>
        <ReceiptPill>{receipt.transactionId}</ReceiptPill>
        <ReceiptPill>{receipt.id}</ReceiptPill>
      </div>
    </div>
  );
}

function ReceiptPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-[var(--success-pill-border)] px-2.5 py-1.5">
      {children}
    </span>
  );
}
