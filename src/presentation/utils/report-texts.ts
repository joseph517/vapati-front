import type {
  ReportReason,
  ReportedEntityType,
} from "@/domain/reports/report.types";

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  SPAM: "Spam",
  INAPPROPRIATE_CONTENT: "Contenido inapropiado",
  HARASSMENT: "Acoso",
  FRAUD: "Fraude o estafa",
  MISINFORMATION: "Información falsa",
  IMPERSONATION: "Suplantación de identidad",
  OTHER: "Otro",
};

export const REPORT_TITLES: Record<ReportedEntityType, string> = {
  CAMPAIGN: "Reportar campaña",
  PUBLICATION: "Reportar publicación",
  USER: "Reportar usuario",
};

export const REPORT_NOT_FOUND_TEXTS: Record<ReportedEntityType, string> = {
  CAMPAIGN:
    "Esta campaña ya no está disponible. Puede que la hayan borrado o cerrado.",
  PUBLICATION:
    "Esta publicación ya no está disponible. Puede que la hayan borrado.",
  USER: "Este usuario ya no está disponible. Puede que haya borrado su cuenta.",
};

export const REPORT_DUPLICATE_TEXT =
  "Ya habías reportado esto. Lo estamos revisando.";

export const REPORT_LIMIT_TEXT =
  "Alcanzaste el límite de 10 reportes por día. Podés volver a intentar mañana.";
