import { cva, type VariantProps } from "class-variance-authority";

import type { ElementProps } from "./element-props.js";

const badgeVariants = cva("inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap", {
  variants: {
    tone: {
      neutral: "border-border bg-card text-muted-foreground",
      accent: "border-primary/20 bg-accent text-accent-foreground",
      success: "border-success/25 bg-success-subtle text-success-strong",
      warning: "border-warning/30 bg-warning-subtle text-warning-strong",
      destructive: "border-destructive/25 bg-destructive-subtle text-destructive-strong",
    },
    size: {
      md: "px-2.5 py-0.5 text-caption",
      // Inline: rides along body text (node tags, list rows) without
      // outweighing it; the tone keeps its fill but drops the outline.
      inline: "border-transparent px-1.5 text-caption",
    },
  },
  defaultVariants: { size: "md", tone: "neutral" },
});

export type BadgeProps = ElementProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ size, tone, ...properties }: BadgeProps) {
  return <span {...properties} className={badgeVariants({ size, tone })} />;
}

export function BadgeDot() {
  return <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />;
}
