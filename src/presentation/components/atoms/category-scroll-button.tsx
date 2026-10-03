export function CategoryScrollButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex size-[34px] shrink-0 items-center justify-center rounded-full border border-input bg-white text-muted-foreground hover:border-[var(--border-strong)]"
      aria-label={
        direction === "left"
          ? "Desplazar categorías a la izquierda"
          : "Desplazar categorías a la derecha"
      }
    >
      {direction === "left" ? "‹" : "›"}
    </button>
  );
}
