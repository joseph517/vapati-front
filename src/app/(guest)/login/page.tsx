import { Suspense } from "react";
import { LoginPage } from "@/presentation/pages/auth/login-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}
