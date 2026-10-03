"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/data/auth/auth.service";
import { useAuthStore } from "@/data/auth/session-store";
import { toErrorMessage } from "@/domain/shared/errors";
import {
  BlockedAccountAlert,
} from "@/presentation/components/molecules/auth/blocked-account-alert";
import { Alert, AlertDescription } from "@/presentation/components/ui/alert";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";

const FLASH_MESSAGES: Record<string, string> = {
  "logged-out": "Cerraste sesión.",
  registered: "Tu cuenta quedó creada. Entrá con tu email y contraseña.",
  "session-expired": "Tu sesión expiró. Volvé a entrar.",
  "account-deleted":
    "Borraste tu cuenta. Si volvés a entrar con tu email y contraseña, se restaura.",
  "credentials-changed":
    "Actualizaste tu email o tu contraseña. Entrá de nuevo con los datos nuevos.",
};

export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const blockedMessage = useAuthStore((state) => state.blockedMessage);
  const clearBlockedMessage = useAuthStore(
    (state) => state.clearBlockedMessage
  );

  const flash = blockedMessage
    ? undefined
    : FLASH_MESSAGES[searchParams.get("flash") ?? ""];
  const initialEmail = searchParams.get("email") ?? "";
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setFormError("Completá tu email y tu contraseña.");
      return;
    }

    setFormError(null);
    clearBlockedMessage();
    setSubmitting(true);
    try {
      const data = await authService.login(email, password);
      setSession(data);
      router.replace("/campaigns");
    } catch (error) {
      setFormError(toErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-full items-center justify-center px-6 py-12">
      <div className="w-full max-w-[400px]">
        <h1 className="font-serif text-[30px] leading-[1.1] font-medium tracking-[-0.015em] text-foreground">
          VaPaTi
        </h1>
        <p className="mt-2 mb-7 text-sm text-muted-foreground">
          Entrá para ver las campañas y aportar a las que te importan.
        </p>

        {blockedMessage && <BlockedAccountAlert message={blockedMessage} />}

        {flash && (
          <Alert className="mb-3.5 border-[var(--notice-border)] bg-[var(--notice-bg)]">
            <AlertDescription className="flex items-center gap-2 text-[13.5px] text-[var(--notice-ink)]">
              <span className="size-1.5 shrink-0 rounded-full bg-primary" />
              {flash}
            </AlertDescription>
          </Alert>
        )}

        {formError && (
          <Alert
            variant="destructive"
            className="mb-3.5 border-[var(--danger-border)] bg-[var(--danger-bg)]"
          >
            <AlertDescription className="text-[13.5px]">
              {formError}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="email"
              className="text-[11.5px] font-medium tracking-[.07em] text-[var(--ink-label)] uppercase"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className="bg-secondary"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="password"
              className="text-[11.5px] font-medium tracking-[.07em] text-[var(--ink-label)] uppercase"
            >
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              // The email is already filled in: what is missing is the password.
              autoFocus={initialEmail !== ""}
              className="bg-secondary"
            />
          </div>

          <div className="mt-1 flex items-center gap-3">
            <Button type="submit" disabled={submitting} className="flex-1">
              Entrar
            </Button>
            {submitting && (
              <span className="animate-pulse text-[13px] text-muted-foreground opacity-85">
                enviando…
              </span>
            )}
          </div>
        </form>

        <div className="mt-7 border-t border-[var(--divider)] pt-4 text-[13.5px] text-muted-foreground">
          ¿No tenés cuenta?{" "}
          <Link href="/register" className="text-primary underline">
            Registrate
          </Link>
        </div>
      </div>
    </main>
  );
}
