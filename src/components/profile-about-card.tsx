import { CategoryPill } from "@/components/category-pill";
import { cn } from "@/lib/utils";

interface ProfileAboutCardProps {
  aboutTitle: string; // "Sobre vos" | "Sobre {firstName}"
  description: string;
  categories: string[];
}

const HEADING_CLASS =
  "text-[11.5px] font-medium tracking-[.09em] text-[var(--ink-eyebrow)] uppercase";

// Description and interests. Without a description it starts at "Intereses", with no divider.
export function ProfileAboutCard({
  aboutTitle,
  description,
  categories,
}: ProfileAboutCardProps) {
  const hasDescription = description.trim() !== "";
  const hasCategories = categories.length > 0;

  if (!hasDescription && !hasCategories) return null;

  return (
    <section className="mt-[30px] rounded-xl border border-border bg-card p-6">
      {hasDescription && (
        <>
          <h2 className={cn(HEADING_CLASS, "mb-2.5")}>{aboutTitle}</h2>
          <p className="max-w-[62ch] text-base leading-[1.65] text-pretty text-[var(--ink-body)]">
            {description}
          </p>
        </>
      )}
      {hasCategories && (
        <div
          className={cn(
            hasDescription &&
              "mt-[22px] border-t border-[var(--divider)] pt-[22px]"
          )}
        >
          <h2 className={cn(HEADING_CLASS, "mb-3")}>Intereses</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <CategoryPill key={category}>{category}</CategoryPill>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
