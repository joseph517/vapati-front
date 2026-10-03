import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/presentation/components/ui/alert";

// The message comes from the backend as-is (in English), so it is marked lang="en".
export function BlockedAccountAlert({ message }: { message: string }) {
  return (
    <Alert
      variant="destructive"
      className="mb-4 flex flex-col gap-[7px] rounded-[9px] border-[var(--danger-border)] bg-[var(--danger-bg)] px-3.5 py-3 text-[var(--destructive)]"
    >
      <AlertTitle className="text-[11.5px] leading-none font-semibold tracking-[.07em] uppercase">
        Cuenta bloqueada
      </AlertTitle>
      <AlertDescription
        lang="en"
        className="text-[13.5px] leading-[1.5] text-pretty text-[var(--destructive)]!"
      >
        {message}
      </AlertDescription>
    </Alert>
  );
}
