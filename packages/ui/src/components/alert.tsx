import { cva, type VariantProps } from "class-variance-authority";

import type { ElementProps } from "./element-props.js";

const alertVariants = cva("w-full rounded-md border px-4 py-3 text-body", {
  variants: {
    tone: {
      neutral: "border-border bg-card text-foreground",
      success: "border-success/25 bg-success-subtle text-success-strong",
      warning: "border-warning/30 bg-warning-subtle text-warning-strong",
      destructive: "border-destructive/25 bg-destructive-subtle text-destructive-strong",
    },
  },
  defaultVariants: { tone: "neutral" },
});

export type AlertProps = ElementProps<"div"> & VariantProps<typeof alertVariants>;

export function Alert({ tone, ...properties }: AlertProps) {
  return (
    <div
      {...properties}
      className={alertVariants({ tone })}
      role={tone === "destructive" ? "alert" : (properties.role ?? "status")}
    />
  );
}

export function AlertTitle(properties: ElementProps<"p">) {
  return <p {...properties} className="mb-1 font-semibold" />;
}
