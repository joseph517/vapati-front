"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CampaignResponseDTO } from "@/domain/campaigns/campaign.types";
import type {
  CreateDonationRequest,
  CreateDonationResponse,
  DonationReceipt,
} from "@/domain/donations/donation.types";
import {
  ApiClientError,
  UNEXPECTED_ERROR_MESSAGE,
} from "@/domain/shared/errors";
import { apiFetch } from "@/lib/api";
import { validateDonationAmount } from "@/lib/donations";
import { cn, formatCurrencyCOP } from "@/lib/utils";

const SUGGESTED_AMOUNTS = [10000, 25000, 50000, 100000];

export function DonateDialog({
  open,
  onOpenChange,
  campaign,
  accessToken,
  onDonated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: CampaignResponseDTO;
  accessToken: string | null;
  onDonated: (receipt: DonationReceipt) => void;
}) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAmount("");
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amountError = validateDonationAmount(amount);
    if (amountError) {
      setError(amountError);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const body: CreateDonationRequest = {
        campaignId: campaign.id,
        amount: Number(amount),
      };
      const data = await apiFetch<CreateDonationResponse>("/api/donations", {
        method: "POST",
        accessToken,
        body,
      });
      onDonated({ ...data.donation, message: data.message });
      onOpenChange(false);
    } catch (err) {
      if (!(err instanceof ApiClientError)) {
        setError(UNEXPECTED_ERROR_MESSAGE);
      } else if (err.fields && Object.keys(err.fields).length > 0) {
        // A "Validation failed" 400: show the field message, not the generic one.
        setError(err.fields.amount ?? Object.values(err.fields)[0]);
      } else {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-2rem)] max-w-[430px] gap-4 rounded-2xl border border-input bg-card p-[26px] shadow-[0_24px_60px_rgba(38,32,27,0.22)]"
      >
        <DialogHeader className="flex-row items-center justify-between space-y-0">
          <DialogTitle className="font-serif text-2xl font-medium tracking-[-0.01em] text-foreground">
            Donar
          </DialogTitle>
          <DialogClose asChild>
            <button
              type="button"
              aria-label="Cerrar"
              className="text-xl leading-none text-[var(--ink-faint)] hover:text-foreground"
            >
              ×
            </button>
          </DialogClose>
        </DialogHeader>

        <p className="-mt-2 text-[13.5px] text-muted-foreground">
          {campaign.name}
        </p>

        {error && (
          <Alert
            variant="destructive"
            className="border-[var(--danger-border)] bg-[var(--danger-bg)]"
          >
            <AlertDescription className="text-[13.5px]">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="donation-amount"
              className="text-[11.5px] font-medium tracking-[.07em] text-[var(--ink-label)] uppercase"
            >
              Monto
            </Label>
            <Input
              id="donation-amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="h-auto bg-secondary py-3 text-[17px]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {SUGGESTED_AMOUNTS.map((suggested) => (
              <button
                key={suggested}
                type="button"
                onClick={() =>
                  setAmount((current) =>
                    String((Number(current) || 0) + suggested)
                  )
                }
                className={cn(
                  "rounded-full border border-input bg-white px-3.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors",
                  "hover:border-[var(--border-strong)] hover:text-foreground"
                )}
              >
                {formatCurrencyCOP(suggested)}
              </button>
            ))}
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full py-[13px] text-[15px] font-semibold"
          >
            {submitting ? "procesando…" : "Confirmar donación"}
          </Button>

          <p className="text-center text-xs text-[var(--ink-faint)]">
            El backend aprueba la donación de forma inmediata. No hay
            pasarela de pago.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
