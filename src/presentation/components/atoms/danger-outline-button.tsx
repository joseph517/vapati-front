import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/presentation/utils/cn";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- props are declared as interfaces
interface DangerOutlineButtonProps
  extends Omit<ComponentProps<typeof Button>, "variant" | "size"> {}

// Red outline button that opens a destructive confirmation ("Borrar campaña", "Borrar cuenta")
export function DangerOutlineButton({
  className,
  ...props
}: DangerOutlineButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "border-[var(--danger-border)] bg-white text-destructive hover:border-[var(--danger-border-strong)] hover:bg-[var(--danger-bg)] hover:text-destructive",
        className
      )}
      {...props}
    />
  );
}
