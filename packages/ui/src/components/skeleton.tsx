import type { ElementProps } from "./internal/element-props.js";
import { customResponsive, type Responsive } from "./layout.js";

export type SkeletonProps = ElementProps<"span"> &
  Readonly<{
    loading?: boolean;
    width?: Responsive<string>;
    height?: Responsive<string>;
  }>;

// A skeleton stands in for text inside the component that will show it, so the text's own role sets
// its geometry; without text it draws a block of the given size.
export function Skeleton({ loading = true, children, width, height, ...props }: SkeletonProps) {
  if (!loading) return children;
  const style: Record<string, string> = {};
  const classes = ["cairn-Skeleton", ...customResponsive("w", width, style), ...customResponsive("h", height, style)];
  return (
    <span
      {...props}
      aria-hidden
      className={classes.join(" ")}
      data-inline={children == null ? undefined : ""}
      inert
      style={style}
      tabIndex={-1}
    >
      {children}
    </span>
  );
}
