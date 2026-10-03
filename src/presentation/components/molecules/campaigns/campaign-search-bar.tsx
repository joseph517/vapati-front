import type { FormEvent } from "react";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";

export function CampaignSearchBar({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-[18px] flex flex-wrap items-center gap-3"
    >
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar campañas"
        className="max-w-[460px] min-w-[220px] flex-1 bg-secondary"
      />
      <Button type="submit" className="px-[26px] py-[11px] text-sm font-semibold">
        Buscar
      </Button>
    </form>
  );
}
