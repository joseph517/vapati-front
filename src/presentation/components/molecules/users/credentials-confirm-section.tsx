import {
  getCredentialsNotice,
  type CredentialsChange,
} from "@/domain/users/profile-form";
import { NoticeAlert } from "@/presentation/components/atoms/notice-alert";
import {
  FormTextField,
} from "@/presentation/components/molecules/form-text-field";
import {
  ProfileFormSection,
} from "@/presentation/components/molecules/users/profile-form-section";

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
