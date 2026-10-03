import { FieldError } from "@/components/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "@/components/user-avatar";
import { USER_MAX_LENGTHS } from "@/domain/users/user-validation";
import { FIELD_LABEL_CLASSES, INVALID_FIELD_CLASSES } from "@/lib/form-classes";
import { cn } from "@/lib/utils";

interface ProfilePictureFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  firstName: string;
  lastName: string;
}

// Photo URL with a 32px preview that falls back to the initials.
export function ProfilePictureField({
  value,
  onChange,
  error,
  firstName,
  lastName,
}: ProfilePictureFieldProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor="profilePicture" className={FIELD_LABEL_CLASSES}>
        Foto de perfil
      </Label>
      <div className="flex items-center gap-2">
        <Input
          id="profilePicture"
          placeholder="URL"
          value={value}
          maxLength={USER_MAX_LENGTHS.profilePicture}
          aria-invalid={error ? true : undefined}
          onChange={(event) => onChange(event.target.value)}
          className={cn("bg-secondary", INVALID_FIELD_CLASSES)}
        />
        <span title="Vista previa" className="shrink-0">
          <UserAvatar
            key={value}
            size="sm"
            firstName={firstName}
            lastName={lastName}
            src={value.trim() || null}
          />
        </span>
      </div>
      <FieldError message={error} />
    </div>
  );
}
