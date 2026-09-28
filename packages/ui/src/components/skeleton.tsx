import { cloneElement, isValidElement, type CSSProperties, type HTMLAttributes, type ReactElement } from "react";

import type { ElementProps } from "./internal/element-props.js";
import { customResponsive, type Responsive } from "./layout.js";

export type SkeletonProps = ElementProps<"span"> &
  Readonly<{
    loading?: boolean;
    width?: Responsive<string>;
    height?: Responsive<string>;
  }>;

// A skeleton either wraps the element it stands in for, keeping its geometry, or draws a sized block.
export function Skeleton({ loading = true, children, width, height, ...props }: SkeletonProps) {
  if (!loading) return children;
  const style: Record<string, string> = {};
  const classes = ["cairn-Skeleton", ...customResponsive("w", width, style), ...customResponsive("h", height, style)];
  if (isValidElement(children) && typeof children.type === "string") {
    const child = children as ReactElement<HTMLAttributes<HTMLElement>>;
    return cloneElement(child, {
      ...props,
      "aria-hidden": true,
      className: [...classes, child.props.className].filter(Boolean).join(" "),
      inert: true,
      style: { ...child.props.style, ...style } as CSSProperties,
      tabIndex: -1,
    });
  }
  return (
    <span
      {...props}
      aria-hidden
      className={classes.join(" ")}
      data-inline={isValidElement(children) || children === undefined ? undefined : ""}
      inert
      style={style}
      tabIndex={-1}
    >
      {children}
    </span>
  );
}
