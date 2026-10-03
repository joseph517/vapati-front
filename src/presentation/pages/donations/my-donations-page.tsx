"use client";

import Link from "next/link";
import { donationsService } from "@/data/donations/donations.service";
import {
  DonationRowsSkeleton,
} from "@/presentation/components/molecules/donations/donation-rows-skeleton";
import {
  MyDonationRow,
} from "@/presentation/components/molecules/donations/my-donation-row";
import { EmptyState } from "@/presentation/components/molecules/empty-state";
import { ErrorCard } from "@/presentation/components/molecules/error-card";
import { Button } from "@/presentation/components/ui/button";
import { useApiQuery } from "@/presentation/hooks/shared/use-api-query";

const LIST_CARD_CLASS =
  "overflow-hidden rounded-xl border border-border bg-card";

export function MyDonationsPage() {
  // Fetched on mount and on "Reintentar". The backend already sends newest first.
  const { data, loading, error, reload } = useApiQuery(
    donationsService.keys.mine(),
    donationsService.listMine
  );
  const items = data?.donations ?? [];
  const total = data?.total ?? 0;

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
          message={error.message}
          actionLabel="Reintentar"
          onAction={() => reload()}
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
