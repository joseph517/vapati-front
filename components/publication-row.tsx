import Link from "next/link";
import { publicationAuthorName } from "@/lib/publications";
import type { PublicationResponseDTO } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

// One entry of the campaign's "Novedades" list.
export function PublicationRow({
  publication,
}: {
  publication: PublicationResponseDTO;
}) {
  const profileHref = `/users/${publication.userId}`;

  return (
    <article className="border-t border-[var(--divider)] py-[18px]">
      <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
        <Link
          href={profileHref}
          className="text-[13.5px] font-medium text-foreground hover:text-primary"
        >
          {publicationAuthorName(publication)}
        </Link>
        <Link
          href={profileHref}
          className="text-[13.5px] text-muted-foreground hover:text-foreground"
        >
          @{publication.userName}
        </Link>
        <span className="text-[12.5px] text-[var(--ink-faint)]">
          · {formatDateTime(publication.createdAt)}
        </span>
      </div>
      <p className="mt-2 max-w-[62ch] text-[15px] leading-[1.55] whitespace-pre-wrap text-[var(--ink-body)] [overflow-wrap:anywhere]">
        {publication.description}
      </p>
    </article>
  );
}
