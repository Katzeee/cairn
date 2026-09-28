import type { CairnTextRole, CairnTone } from "@cairn/design-tokens";

export type ControlSize = "sm" | "md" | "lg";
export type Tone = CairnTone;
export type TextRole = CairnTextRole;
export type TextTone = "default" | "muted" | Exclude<Tone, "neutral">;
export type Weight = "regular" | "medium" | "semibold" | "bold";

export function textToneAttribute(tone: TextTone | undefined) {
  return tone === undefined || tone === "default" ? undefined : tone;
}
