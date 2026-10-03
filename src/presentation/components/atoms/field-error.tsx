export function FieldError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p className="mt-[7px] text-[12.5px] leading-[1.45] text-destructive">
      {message}
    </p>
  );
}
