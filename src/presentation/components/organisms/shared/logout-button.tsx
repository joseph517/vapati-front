"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@/presentation/hooks/auth/use-auth-actions";
import { useSessionActions } from "@/presentation/hooks/auth/use-session-actions";

export function LogoutButton() {
  const { revokeRefreshToken } = useAuthActions();
  const { clearSession } = useSessionActions();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);

    await revokeRefreshToken();
    // The protected layout redirects to /login?flash=logged-out once the session is cleared.
    clearSession();
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
