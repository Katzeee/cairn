import { Progress as BaseProgress } from "@base-ui/react/progress";

import type { Tone } from "./internal/variants.js";

export type ProgressProps = Readonly<{
  value: number | null;
  max?: number;
  label?: string;
  tone?: Tone;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}>;

export function Progress({ value, max = 100, label, tone = "accent", ...props }: ProgressProps) {
  return (
    <BaseProgress.Root
      {...props}
      className="cairn-Progress"
      data-indeterminate={value === null ? "" : undefined}
      data-tone={tone}
      max={max}
      value={value}
    >
      {label === undefined ? null : (
        <div className="cairn-ProgressHeader">
          <BaseProgress.Label className="cairn-ProgressLabel">{label}</BaseProgress.Label>
          <BaseProgress.Value className="cairn-ProgressValue" />
        </div>
      )}
      <BaseProgress.Track className="cairn-ProgressTrack">
        <BaseProgress.Indicator className="cairn-ProgressIndicator" />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
