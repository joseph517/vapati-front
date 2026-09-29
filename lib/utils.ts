export { cn } from "cn";

export function formatCurrencyCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}

const dateTimeFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

// e.g. "24 de sept de 2026, 06:42 p. m."
export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}
