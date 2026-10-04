import { useId } from "react";
import {
  DEFAULT_SANCTION_REASONS,
  SANCTION_REASON_MAX_LENGTH,
  SANCTION_REASON_WARNING_AT,
} from "@/domain/admin/admin-reports";
import { CharCounter } from "@/presentation/components/atoms/char-counter";
import { FieldError } from "@/presentation/components/atoms/field-error";
import { NoticeAlert } from "@/presentation/components/atoms/notice-alert";
import { Label } from "@/presentation/components/ui/label";
import { Textarea } from "@/presentation/components/ui/textarea";
import {
  defaultSanctionReasonNotice,
  REVIEW_NOTES_HELP,
  REVIEW_NOTES_LABEL,
  REVIEW_NOTES_SANCTION_HELP,
  REVIEW_NOTES_SANCTION_LABEL,
  REVIEW_NOTES_SANCTION_PLACEHOLDER,
} from "@/presentation/utils/admin-report-texts";
import { cn } from "@/presentation/utils/cn";
import {
  FIELD_LABEL_CLASSES,
  INVALID_FIELD_CLASSES,
} from "@/presentation/utils/form-classes";

// With a sanction the notes are the reason the blocked user sees, so the field
// shows a counter and the backend's default reason when it is empty.
// No maxLength: the counter and the validation show the excess.
export function ReviewNotesField({
  value,
  onChange,
  sanction,
  disabled = false,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  sanction: "USER_BANNED" | "USER_SUSPENDED" | null;
  disabled?: boolean;
  error?: string | null;
}) {
  const id = useId();
  const trimmedLength = value.trim().length;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id} className={cn(FIELD_LABEL_CLASSES, "leading-none")}>
          {sanction ? REVIEW_NOTES_SANCTION_LABEL : REVIEW_NOTES_LABEL}
        </Label>
        <span className="text-[12.5px] text-[var(--ink-faint)]">Opcional</span>
      </div>
      <Textarea
        id={id}
        rows={4}
        placeholder={sanction ? REVIEW_NOTES_SANCTION_PLACEHOLDER : undefined}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        // dark: overrides shadcn's dark:bg-input/30 (the app has no dark theme).
        className={cn(
          "min-h-24 resize-y bg-white [overflow-wrap:anywhere] dark:bg-white",
          INVALID_FIELD_CLASSES
        )}
      />
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12.5px] text-[var(--ink-faint)]">
          {sanction ? REVIEW_NOTES_SANCTION_HELP : REVIEW_NOTES_HELP}
        </p>
        {sanction && (
          <span className="whitespace-nowrap">
            <CharCounter
              length={trimmedLength}
              max={SANCTION_REASON_MAX_LENGTH}
              warnAt={SANCTION_REASON_WARNING_AT}
            />
          </span>
        )}
      </div>
      {sanction && trimmedLength === 0 && (
        <NoticeAlert role="note" className="mt-1 text-[13px]">
          {defaultSanctionReasonNotice(DEFAULT_SANCTION_REASONS[sanction])}
        </NoticeAlert>
      )}
      <FieldError message={error} />
    </div>
  );
}
