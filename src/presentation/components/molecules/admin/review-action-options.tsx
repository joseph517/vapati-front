import { isIrreversibleAction } from "@/domain/admin/admin-reports";
import type {
  ActionTaken,
  ReportedEntityType,
} from "@/domain/reports/report.types";
import {
  ACTION_TAKEN_LABELS,
  actionDescription,
} from "@/presentation/utils/admin-report-texts";
import { cn } from "@/presentation/utils/cn";

// Action cards of the review form. The irreversible ones use the danger palette.
export function ReviewActionOptions({
  label,
  actions,
  entityType,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  actions: readonly ActionTaken[];
  entityType: ReportedEntityType;
  value: ActionTaken | null;
  onChange: (action: ActionTaken) => void;
  disabled?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-col gap-2">
      {actions.map((action) => {
        const checked = action === value;
        const irreversible = isIrreversibleAction(action);
        return (
          <button
            key={action}
            type="button"
            role="radio"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => {
              if (!checked) onChange(action);
            }}
            className={cn(
              "flex w-full items-start gap-3 rounded-lg border px-3.5 py-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60",
              irreversible
                ? "hover:border-[var(--danger-border-strong)]"
                : "hover:border-[var(--border-strong)]",
              checked && irreversible &&
                "border-[var(--danger-border-strong)] bg-[var(--danger-bg)]",
              checked && !irreversible &&
                "border-[var(--accent-soft-border)] bg-accent",
              !checked && irreversible && "border-[var(--danger-border)] bg-white",
              !checked && !irreversible && "border-input bg-white"
            )}
          >
            <span
              aria-hidden
              className={cn(
                "mt-[3px] flex size-4 shrink-0 items-center justify-center rounded-full border bg-white",
                !checked && "border-[var(--border-strong)]",
                checked && irreversible && "border-destructive",
                checked && !irreversible && "border-primary"
              )}
            >
              {checked && (
                <span
                  className={cn(
                    "size-2 rounded-full",
                    irreversible ? "bg-destructive" : "bg-primary"
                  )}
                />
              )}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "text-sm font-medium",
                    irreversible ? "text-destructive" : "text-foreground"
                  )}
                >
                  {ACTION_TAKEN_LABELS[action]}
                </span>
                {irreversible && (
                  <span className="rounded-full border border-[var(--danger-border)] bg-[var(--danger-bg)] px-2 py-px text-[11px] leading-[1.5] font-semibold tracking-[.06em] text-destructive uppercase">
                    Irreversible
                  </span>
                )}
              </span>
              <span className="text-[13px] leading-[1.45] text-muted-foreground">
                {actionDescription(action, entityType)}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
