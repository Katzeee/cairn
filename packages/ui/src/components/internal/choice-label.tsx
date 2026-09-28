import type { ReactNode } from "react";

export type ChoiceLabelProps = Readonly<{ label?: ReactNode; description?: ReactNode }>;

// Checkboxes and radios lead their label; switches trail it, like a settings row.
export function ChoiceLabel({
  control,
  placement,
  label,
  description,
}: ChoiceLabelProps & Readonly<{ control: ReactNode; placement: "start" | "end" }>) {
  if (label === undefined) return control;
  return (
    <label className="cairn-ChoiceLabel" data-control={placement}>
      {placement === "start" ? <span className="cairn-ChoiceControl">{control}</span> : null}
      <span className="cairn-ChoiceText">
        <span className="cairn-ChoiceTitle">{label}</span>
        {description === undefined ? null : <span className="cairn-ChoiceDescription">{description}</span>}
      </span>
      {placement === "end" ? <span className="cairn-ChoiceControl">{control}</span> : null}
    </label>
  );
}
