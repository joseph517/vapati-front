"use client";

import { useState, type FormEvent } from "react";
import type { CreatePublicationRequest } from "@/domain/publications/publication.types";
import {
  PUBLICATION_COUNTER_WARNING_AT,
  PUBLICATION_MAX_LENGTH,
  isPublicationRejectedByCampaign,
  publicationDescriptionError,
} from "@/domain/publications/publications";
import { toErrorMessage } from "@/domain/shared/errors";
import { CharCounter } from "@/presentation/components/atoms/char-counter";
import { FieldError } from "@/presentation/components/atoms/field-error";
import { NoticeAlert } from "@/presentation/components/atoms/notice-alert";
import { Button } from "@/presentation/components/ui/button";
import { Label } from "@/presentation/components/ui/label";
import { Textarea } from "@/presentation/components/ui/textarea";
import { usePublicationActions } from "@/presentation/hooks/publications/use-publication-actions";
import { cn } from "@/presentation/utils/cn";
import {
  FIELD_LABEL_CLASSES,
  INVALID_FIELD_CLASSES,
} from "@/presentation/utils/form-classes";

// "Nueva publicación" box of the "Novedades" section, only for the campaign owner.
export function PublicationComposer({
  campaignId,
  onPublished,
  onCampaignStale,
}: {
  campaignId: number;
  onPublished: () => void;
  onCampaignStale: () => void; // a 400 not from validation: the campaign may be closed now
}) {
  const publicationActions = usePublicationActions();
  const [draft, setDraft] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  const description = draft.trim();

  function handleChange(value: string) {
    setDraft(value);
    setFieldError(null);
    setPublishError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!description || publishing) return;

    setPublishing(true);
    setFieldError(null);
    setPublishError(null);
    try {
      const body: CreatePublicationRequest = { description };
      await publicationActions.create(campaignId, body);
      setDraft("");
      onPublished();
    } catch (err) {
      const descriptionError = publicationDescriptionError(err);
      if (descriptionError) {
        setFieldError(descriptionError);
      } else {
        setPublishError(toErrorMessage(err));
        if (isPublicationRejectedByCampaign(err)) onCampaignStale();
      }
    } finally {
      setPublishing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-1.5">
      <Label htmlFor="new-publication" className={FIELD_LABEL_CLASSES}>
        Nueva publicación
      </Label>
      <Textarea
        id="new-publication"
        rows={3}
        maxLength={PUBLICATION_MAX_LENGTH}
        placeholder="Un avance, una compra, un agradecimiento a quienes donaron…"
        value={draft}
        disabled={publishing}
        onChange={(event) => handleChange(event.target.value)}
        aria-invalid={fieldError ? true : undefined}
        // dark: overrides shadcn's dark:bg-input/30 (the app has no dark theme).
        className={cn("resize-y bg-white dark:bg-white", INVALID_FIELD_CLASSES)}
      />
      <FieldError message={fieldError} />
      {publishError && (
        <NoticeAlert tone="danger" className="mt-1">
          {publishError}
        </NoticeAlert>
      )}
      <div className="mt-1 flex items-center gap-3">
        <CharCounter
          length={draft.length}
          max={PUBLICATION_MAX_LENGTH}
          warnAt={PUBLICATION_COUNTER_WARNING_AT}
        />
        <div className="ml-auto flex items-center gap-2.5">
          {publishing && (
            <span className="animate-pulse text-[13px] text-muted-foreground opacity-85">
              procesando…
            </span>
          )}
          <Button
            type="submit"
            disabled={!description || publishing}
            className="px-3.5 font-semibold"
          >
            Publicar
          </Button>
        </div>
      </div>
    </form>
  );
}
