import type { ElementProps } from "./internal/element-props.js";
import type { Tone } from "./internal/variants.js";

export type BadgeProps = ElementProps<"span"> &
  Readonly<{
    tone?: Tone;
    size?: "sm" | "md";
  }>;

export function Badge({ tone = "neutral", size = "md", ...props }: BadgeProps) {
  return <span {...props} className="cairn-Badge" data-size={size} data-tone={tone} />;
}
