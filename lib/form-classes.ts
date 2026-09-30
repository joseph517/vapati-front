export const FIELD_LABEL_CLASSES =
  "text-[11.5px] font-medium tracking-[.07em] text-[var(--ink-label)] uppercase";

// Error border from the design, without shadcn's aria-invalid ring.
// The dark: variant overrides shadcn's dark:aria-invalid border, which applies
// with a dark system preference even though the app has no dark theme.
export const INVALID_FIELD_CLASSES =
  "aria-invalid:border-[var(--danger-border-strong)] dark:aria-invalid:border-[var(--danger-border-strong)] aria-invalid:ring-0 aria-invalid:focus-visible:ring-3 aria-invalid:focus-visible:ring-ring/50";
