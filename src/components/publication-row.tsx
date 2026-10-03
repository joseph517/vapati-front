import Link from "next/link";
import { DangerOutlineButton } from "@/components/danger-outline-button";
import type {
  PublicationResponseDTO,
} from "@/domain/publications/publication.types";
import { publicationAuthorName } from "@/lib/publications";
import { formatDateTime } from "@/lib/utils";

// One entry of the campaign's "Novedades" list. "Borrar" only with `onDelete`.
export function PublicationRow({
  publication,
  onDelete,
}: {
  publication: PublicationResponseDTO;
  onDelete?: () => void;
}) {
  const profileHref = `/users/${publication.userId}`;

  return (
    <article className="border-t border-[var(--divider)] py-[18px]">
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
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
        {onDelete && (
          <DangerOutlineButton type="button" onClick={onDelete}>
            Borrar
          </DangerOutlineButton>
        )}
      </div>
      <p className="mt-2 max-w-[62ch] text-[15px] leading-[1.55] whitespace-pre-wrap text-[var(--ink-body)] [overflow-wrap:anywhere]">
        {publication.description}
      </p>
    </article>
  );
}
