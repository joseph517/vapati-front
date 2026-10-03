"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authService } from "@/data/auth/auth.service";
import { useAuthStore } from "@/data/auth/session-store";

export function LogoutButton() {
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);

    await authService.revokeRefreshToken();
    // The protected layout redirects to /login?flash=logged-out once the session is cleared.
    useAuthStore.getState().clearSession();
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
