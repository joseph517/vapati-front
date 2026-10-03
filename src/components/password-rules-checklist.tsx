import {
  PASSWORD_RULES,
  PASSWORD_SPECIAL_CHARS,
} from "@/domain/users/user-validation";
import { cn } from "@/lib/utils";

interface PasswordRulesChecklistProps {
  password: string;
}

// Always visible. Each rule turns green as soon as it is met.
export function PasswordRulesChecklist({ password }: PasswordRulesChecklistProps) {
  return (
    <ul className="mt-2.5 flex flex-wrap gap-x-3.5 gap-y-1.5 text-[12.5px] text-[var(--ink-faint)]">
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password);
        return (
          <li
            key={rule.id}
            className={cn(
              "flex items-center gap-1.5",
              met && "text-[var(--success-ink-soft)]"
            )}
          >
            <span
              aria-hidden
              className={cn(
                "size-1.5 rounded-full",
                met ? "bg-[var(--success)]" : "bg-[var(--border-dashed)]"
              )}
            />
            <span>
              {rule.label}
              {rule.id === "special" && (
                <>
                  {" "}
                  <span className="font-mono text-xs">{PASSWORD_SPECIAL_CHARS}</span>
                </>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
