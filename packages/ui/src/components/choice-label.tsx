import type { ReactNode } from "react";

import { cn } from "./cn.js";

export type ChoiceLabelProps = Readonly<{ description?: string; label?: string }>;

export function ChoiceLabel({
  control,
  controlFirst,
  description,
  label,
}: ChoiceLabelProps & Readonly<{ control: ReactNode; controlFirst: boolean }>) {
  if (label === undefined) {
    return control;
  }
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start has-data-disabled:cursor-not-allowed",
        controlFirst ? "gap-3" : "justify-between gap-4",
      )}
    >
      {controlFirst ? <span className="mt-0.5 flex">{control}</span> : null}
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-label font-medium">{label}</span>
        {description === undefined ? null : <span className="text-caption text-muted-foreground">{description}</span>}
      </span>
      {controlFirst ? null : control}
    </label>
  );
}
