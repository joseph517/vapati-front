import { FormTextField } from "@/components/form-text-field";
import { NoticeAlert } from "@/components/notice-alert";
import { ProfileFormSection } from "@/components/profile-form-section";
import { getCredentialsNotice, type CredentialsChange } from "@/lib/profile-form";

interface CredentialsConfirmSectionProps {
  change: Exclude<CredentialsChange, null>;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

// Only rendered when the email or the password changes.
export function CredentialsConfirmSection({
  change,
  value,
  onChange,
  error,
}: CredentialsConfirmSectionProps) {
  return (
    <ProfileFormSection title="Confirmá que sos vos">
      <NoticeAlert role="status">{getCredentialsNotice(change)}</NoticeAlert>
      <FormTextField
        id="currentPassword"
        label="Contraseña actual"
        type="password"
        autoComplete="current-password"
        value={value}
        onChange={onChange}
        error={error}
        className="mt-3.5 max-w-[272px]"
      />
    </ProfileFormSection>
  );
}
