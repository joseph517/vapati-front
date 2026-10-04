import type {
  ActionTaken,
  ReportedEntityType,
  ReportSortBy,
  ReportStatus,
  ReviewTargetStatus,
} from "@/domain/reports/report.types";
import type { SortDirection } from "@/domain/shared/shared.types";

export const REPORT_STATUS_META: Record<
  ReportStatus,
  { label: string; bg: string; fg: string }
> = {
  PENDING: {
    label: "Pendiente",
    bg: "var(--accent)",
    fg: "var(--accent-foreground)",
  },
  UNDER_REVIEW: {
    label: "En revisión",
    bg: "var(--notice-bg)",
    fg: "var(--notice-ink)",
  },
  RESOLVED: { label: "Resuelto", bg: "var(--success-bg)", fg: "var(--success)" },
  REJECTED: { label: "Rechazado", bg: "var(--divider)", fg: "var(--ink-faint)" },
};

export const REVIEW_STATUS_OPTION_LABELS: Record<ReviewTargetStatus, string> = {
  UNDER_REVIEW: "En revisión",
  RESOLVED: "Resolver",
  REJECTED: "Rechazar",
};

export const REPORTED_ENTITY_LABELS: Record<ReportedEntityType, string> = {
  USER: "Usuario",
  PUBLICATION: "Publicación",
  CAMPAIGN: "Campaña",
};

export const ACTION_TAKEN_LABELS: Record<ActionTaken, string> = {
  NO_ACTION: "Sin acción",
  WARNING_SENT: "Advertencia (solo queda registrada)",
  CONTENT_REMOVED: "Eliminar el contenido",
  USER_SUSPENDED: "Suspender 30 días",
  USER_BANNED: "Banear para siempre",
  OTHER: "Otra (solo queda registrada)",
};

export const REPORT_SORT_OPTIONS: readonly {
  sortBy: ReportSortBy;
  sortDirection: SortDirection;
  label: string;
}[] = [
  { sortBy: "createdAt", sortDirection: "desc", label: "Más nuevos primero" },
  { sortBy: "createdAt", sortDirection: "asc", label: "Más viejos primero" },
  // The backend sorts status alphabetically: asc starts with PENDING, desc with UNDER_REVIEW
  { sortBy: "status", sortDirection: "asc", label: "Pendientes primero" },
  { sortBy: "status", sortDirection: "desc", label: "En revisión primero" },
];

export const REVIEW_STATUS_HELP =
  '"Resolver" y "Rechazar" son finales: después el reporte no se puede volver a revisar.';
export const REVIEW_NOTES_LABEL = "Notas del ADMIN";
export const REVIEW_NOTES_SANCTION_LABEL = "Notas del ADMIN · motivo de la sanción";
export const REVIEW_NOTES_HELP = "Cada revisión reemplaza las notas anteriores.";
export const REVIEW_NOTES_SANCTION_HELP =
  "Es el motivo que ve el usuario sancionado cada vez que intenta entrar. Cada revisión reemplaza las notas anteriores.";
export const REVIEW_NOTES_SANCTION_PLACEHOLDER =
  "Explicale al usuario por qué se bloquea su cuenta.";
export const REVIEW_CONFIRM_TITLE = "Confirmar sanción";
export const REVIEW_CONFIRM_NOTE = "No se puede deshacer.";
export const REVIEW_CONFIRM_REASON_LABEL = "Motivo que va a ver el usuario";
export const REVIEW_SAVED_NOTICE = "Revisión guardada.";
export const UNREVIEWED_TEXT = "Pendiente de revisión. Ningún ADMIN lo revisó todavía.";
export const PUBLICATION_NOT_VIEWABLE_TEXT =
  "Las publicaciones no se pueden ver desde el panel.";
export const NO_DESCRIPTION_TEXT = "Sin descripción";
export const NO_NOTES_TEXT = "Sin notas";
export const NO_ACTION_TEXT = "—";
export const DELETED_ACCOUNT_TEXT = "Cuenta borrada";

// "Sin notas, el usuario va a ver "Banned by admin"."
export function defaultSanctionReasonNotice(defaultReason: string): string {
  return `Sin notas, el usuario va a ver "${defaultReason}".`;
}

// "Usuario #7"
export function reportedEntityTitle(type: ReportedEntityType, id: number): string {
  return `${REPORTED_ENTITY_LABELS[type]} #${id}`;
}

export function actionDescription(
  action: ActionTaken,
  type: ReportedEntityType
): string {
  switch (action) {
    case "USER_SUSPENDED":
      return "Bloquea la cuenta del usuario durante 30 días.";
    case "USER_BANNED":
      return "Bloquea la cuenta del usuario para siempre.";
    case "CONTENT_REMOVED":
      return type === "CAMPAIGN"
        ? "Cierra la campaña y la borra."
        : "Borra la publicación.";
    default:
      return "Solo queda registrada en el reporte. Al usuario no le llega ningún aviso.";
  }
}

// Only for the irreversible actions
export function reviewConfirmTexts(
  action: ActionTaken,
  type: ReportedEntityType,
  entityId: number
): { description: string; confirmLabel: string } {
  if (action === "USER_BANNED") {
    return {
      description: `Vas a banear para siempre al usuario #${entityId}.`,
      confirmLabel: "Banear usuario",
    };
  }
  if (action === "USER_SUSPENDED") {
    return {
      description: `Vas a suspender 30 días al usuario #${entityId}.`,
      confirmLabel: "Suspender usuario",
    };
  }
  return {
    description:
      type === "CAMPAIGN"
        ? `Vas a cerrar y eliminar la campaña #${entityId}.`
        : `Vas a eliminar la publicación #${entityId}.`,
    confirmLabel: "Eliminar contenido",
  };
}
