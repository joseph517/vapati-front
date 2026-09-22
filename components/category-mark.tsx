import { CATEGORY_MARKS } from "@/lib/category-marks";

export function CategoryMark({
  index,
  active,
}: {
  index: number;
  active: boolean;
}) {
  const mark = CATEGORY_MARKS[index % CATEGORY_MARKS.length];

  return (
    <span
      className="flex size-9 items-center justify-center border-[1.5px]"
      style={{
        borderRadius: mark.markRadius,
        transform: mark.markTransform,
        borderColor: active ? "#C08E76" : "#DCD0C0",
        backgroundColor: active ? "#F3E7DF" : "#fff",
      }}
    >
      <span
        className="size-[11px]"
        style={{
          borderRadius: mark.dotRadius,
          transform: mark.dotTransform,
          backgroundColor: active ? "#A85A3C" : "#DCD0C0",
        }}
      />
    </span>
  );
}
