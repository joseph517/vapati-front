import type { CampaignStatus } from "@/lib/types";

export const STATUS_META: Record<
  CampaignStatus,
  { label: string; bg: string; fg: string }
> = {
  ACTIVE: { label: "Activa", bg: "var(--success-bg)", fg: "var(--success)" },
  COMPLETED: { label: "Completada", bg: "var(--accent)", fg: "var(--primary)" },
  CLOSED: { label: "Cerrada", bg: "var(--divider)", fg: "var(--ink-faint)" },
};
