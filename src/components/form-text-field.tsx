import { FieldError } from "@/components/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FIELD_LABEL_CLASSES, INVALID_FIELD_CLASSES } from "@/lib/form-classes";
import { cn } from "@/lib/utils";

interface FormTextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  // A string shows the message below the input. `true` only marks the input
  // invalid, for fields whose message is rendered elsewhere.
  error?: string | boolean;
  type?: string;
  maxLength?: number;
  autoComplete?: string;
  className?: string;
}

export function FormTextField({
  id,
  label,
  value,
  onChange,
  error,
  type,
  maxLength,
  autoComplete,
  className,
}: FormTextFieldProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <Label htmlFor={id} className={FIELD_LABEL_CLASSES}>
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={cn("bg-secondary", INVALID_FIELD_CLASSES)}
      />
      {typeof error === "string" && <FieldError message={error} />}
    </div>
  );
}
