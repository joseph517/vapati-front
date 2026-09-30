"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { revokeRefreshToken } from "@/lib/session";
import { useAuthStore } from "@/lib/store/auth-store";

export function LogoutButton() {
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);

    await revokeRefreshToken();
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
