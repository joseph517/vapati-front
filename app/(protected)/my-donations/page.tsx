"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DonationRowsSkeleton } from "@/components/donation-rows-skeleton";
import { EmptyState } from "@/components/empty-state";
import { ErrorCard } from "@/components/error-card";
import { MyDonationRow } from "@/components/my-donation-row";
import { apiFetch, toErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth-store";
import type { DonationListResponse, DonationResponseDTO } from "@/lib/types";

const LIST_CARD_CLASS =
  "overflow-hidden rounded-xl border border-border bg-card";

export default function MyDonationsPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [items, setItems] = useState<DonationResponseDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  // Runs on mount and on "Reintentar". The backend already sends newest first.
  useEffect(() => {
    let cancelled = false;

    apiFetch<DonationListResponse>("/api/donations/my-donations", {
      accessToken,
    })
      .then((data) => {
        if (!cancelled) {
          setItems(data.donations);
          setTotal(data.total);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(toErrorMessage(err));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadToken]);

  function reload() {
    setLoading(true);
    setError(null);
    setReloadToken((token) => token + 1);
  }

  let countLine: string;
  if (loading) {
    countLine = "Cargando…";
  } else if (error) {
    countLine = "No se pudo cargar";
  } else {
    countLine = total === 1 ? "1 donación" : `${total} donaciones`;
  }

  return (
    <main className="mx-auto max-w-[760px] px-6 pt-11 pb-20">
      <div className="mb-[30px]">
        <h1 className="font-serif text-[32px] leading-[1.1] font-medium tracking-[-0.015em] text-foreground">
          Mis donaciones
        </h1>
        <p
          className={
            error && !loading
              ? "mt-1 text-sm text-destructive"
              : "mt-1 text-sm text-muted-foreground"
          }
        >
          {countLine}
        </p>
      </div>

      {loading && (
        <div className={LIST_CARD_CLASS}>
          <DonationRowsSkeleton />
        </div>
      )}

      {!loading && error && (
        <ErrorCard
          title="No pudimos cargar tus donaciones"
          message={error}
          actionLabel="Reintentar"
          onAction={reload}
        />
      )}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="Todavía no donaste"
          description="Cuando dones a una campaña, vas a ver acá el monto, la fecha y el comprobante."
          action={
            <Button asChild className="mt-2">
              <Link href="/campaigns">Ver campañas</Link>
            </Button>
          }
        />
      )}

      {!loading && !error && items.length > 0 && (
        <div className={`${LIST_CARD_CLASS} divide-y divide-[var(--divider)]`}>
          {items.map((donation) => (
            <MyDonationRow key={donation.id} donation={donation} />
          ))}
        </div>
      )}
    </main>
  );
}
