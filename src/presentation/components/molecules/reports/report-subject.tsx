import type { ReportTarget } from "@/domain/reports/report.types";
import { publicationExcerpt } from "@/domain/publications/publications";

// What is being reported, under the dialog title: a line for a campaign or a
// user, a card with the author and an excerpt for a publication.
export function ReportSubject({ target }: { target: ReportTarget }) {
  if (target.type === "PUBLICATION") {
    return (
      <div className="rounded-lg border border-[var(--divider)] bg-secondary px-3.5 py-3 text-left">
        <div className="flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-[13.5px] font-medium text-foreground">
            {target.displayName}
          </span>
          {target.displayHandle && (
            <span className="text-[13.5px] text-muted-foreground">
              @{target.displayHandle}
            </span>
          )}
        </div>
        {target.excerpt && (
          <p className="mt-1 text-[13.5px] leading-[1.5] whitespace-pre-wrap text-[var(--ink-body)] [overflow-wrap:anywhere]">
            {publicationExcerpt(target.excerpt)}
          </p>
        )}
      </div>
    );
  }

  return (
    <p className="text-[14px] text-muted-foreground [overflow-wrap:anywhere]">
      {target.displayName}
      {target.type === "USER" &&
        target.displayHandle &&
        ` · @${target.displayHandle}`}
    </p>
  );
}
