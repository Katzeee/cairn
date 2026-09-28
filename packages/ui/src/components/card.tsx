import type { ElementProps } from "./internal/element-props.js";
import type { ControlSize } from "./internal/variants.js";

export type CardVariant = "surface" | "muted";

export type CardProps = ElementProps<"div", "ref"> &
  Readonly<{
    as?: "div" | "article" | "section";
    variant?: CardVariant;
    size?: ControlSize;
  }>;

export function Card({ as: Element = "div", variant = "surface", size = "md", ...props }: CardProps) {
  return <Element {...props} className="cairn-Card" data-size={size} data-variant={variant} />;
}
