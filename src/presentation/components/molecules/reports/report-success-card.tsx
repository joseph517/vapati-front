// Confirmation inside the report dialog after a 200.
export function ReportSuccessCard() {
  return (
    <div
      role="status"
      className="rounded-xl border border-[var(--success-border)] bg-[var(--success-bg)] px-[18px] py-4"
    >
      <div className="flex items-center gap-2">
        <span className="size-2 shrink-0 rounded-full bg-[var(--success)]" />
        <p className="font-serif text-[16px] font-medium text-[var(--success-ink)]">
          Reporte enviado
        </p>
      </div>
      <p className="mt-1.5 text-[13.5px] leading-[1.5] text-[var(--success-ink-soft)]">
        El equipo de VaPaTi lo va a revisar. No vas a poder ver su estado desde
        tu cuenta.
      </p>
    </div>
  );
}
