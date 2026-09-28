import type { ElementProps } from "./internal/element-props.js";

export type SeparatorProps = ElementProps<"span"> &
  Readonly<{
    orientation?: "horizontal" | "vertical";
    decorative?: boolean;
  }>;

export function Separator({ orientation = "horizontal", decorative = true, ...props }: SeparatorProps) {
  return (
    <span
      {...props}
      aria-orientation={decorative ? undefined : orientation}
      className="cairn-Separator"
      data-orientation={orientation}
      role={decorative ? undefined : "separator"}
    />
  );
}
