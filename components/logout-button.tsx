"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth-store";

export function LogoutButton() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);

    const { accessToken, refreshToken, clearSession } =
      useAuthStore.getState();

    try {
      // Sent as a public request (no `accessToken` option) so a failure never
      // triggers a refresh or expires the session; the bearer goes as a plain header.
      if (refreshToken) {
        await apiFetch("/auth/logout", {
          method: "POST",
          body: { refreshToken },
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : undefined,
        });
      }
    } catch {
      // Logout always succeeds locally, even if the backend call fails.
    } finally {
      clearSession();
      router.replace("/login?flash=logged-out");
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={loggingOut}
      onClick={handleLogout}
      className="gap-[7px]"
    >
      Salir
      {loggingOut && (
        <span className="animate-pulse text-[12.5px] font-normal opacity-85">
          saliendo…
        </span>
      )}
    </Button>
  );
}
