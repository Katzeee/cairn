import type { CairnTextRole, CairnTone } from "@cairn/design-tokens";

export type ControlSize = "sm" | "md" | "lg";
export type Tone = CairnTone;
export type TextRole = CairnTextRole;
export type TextTone = "default" | "muted" | Exclude<Tone, "neutral">;
// An action's importance among its peers. Each component presents it in its own way: a page bar
// keeps a primary action's label and moves secondary ones into More, a callout emphasizes the primary.
export type ActionPriority = "primary" | "default" | "secondary";
export type Weight = "regular" | "medium" | "semibold" | "bold";

export function textToneAttribute(tone: TextTone | undefined) {
  return tone === undefined || tone === "default" ? undefined : tone;
}
