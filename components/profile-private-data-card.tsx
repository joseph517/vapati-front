interface ProfilePrivateDataCardProps {
  email: string;
  phone: string;
}

interface PrivateFieldProps {
  label: string;
  value: string;
}

function PrivateField({ label, value }: PrivateFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11.5px] leading-none font-medium tracking-[.07em] text-[var(--ink-label)] uppercase">
        {label}
      </span>
      <span className="text-[15px] text-foreground [overflow-wrap:anywhere]">
        {value}
      </span>
    </div>
  );
}

// Email and phone. Only on the user's own profile.
export function ProfilePrivateDataCard({
  email,
  phone,
}: ProfilePrivateDataCardProps) {
  return (
    <section className="mt-[18px] rounded-xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h2 className="text-[11.5px] font-medium tracking-[.09em] text-[var(--ink-eyebrow)] uppercase">
          Datos privados
        </h2>
        <p className="text-[12.5px] text-[var(--ink-faint)]">
          Solo los ves vos. No aparecen en tu perfil público.
        </p>
      </div>
      <div className="mt-[18px] grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[18px]">
        <PrivateField label="Email" value={email} />
        <PrivateField label="Teléfono" value={phone} />
      </div>
    </section>
  );
}
