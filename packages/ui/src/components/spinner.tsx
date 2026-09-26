import { cn } from "./cn.js";

export type SpinnerProps = Readonly<{ label?: string; size?: "sm" | "md"; tone?: "current" | "primary" }>;

export function Spinner({ label, size = "md", tone = "current" }: SpinnerProps) {
  return (
    <span
      aria-label={label}
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
        size === "sm" ? "size-4" : "size-5",
        tone === "primary" && "text-primary",
      )}
      role={label === undefined ? "presentation" : "status"}
    />
  );
}
