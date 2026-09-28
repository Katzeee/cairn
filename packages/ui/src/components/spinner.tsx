import type { ReactNode } from "react";

import type { ElementProps } from "./internal/element-props.js";
import type { ControlSize } from "./internal/variants.js";

export type SpinnerProps = ElementProps<"span", "children"> &
  Readonly<{
    size?: ControlSize;
    loading?: boolean;
    children?: ReactNode;
  }>;

export function Spinner({ size = "md", loading = true, children, ...props }: SpinnerProps) {
  if (!loading) return children;
  const labelled = props["aria-label"] !== undefined;
  const indicator = (
    <span
      {...props}
      aria-hidden={labelled ? undefined : true}
      className="cairn-Spinner"
      data-size={size}
      role={labelled ? "status" : undefined}
    />
  );
  if (children === undefined) return indicator;
  return (
    <span className="cairn-SpinnerContainer">
      <span aria-hidden className="cairn-SpinnerContent" inert>
        {children}
      </span>
      <span className="cairn-SpinnerOverlay">{indicator}</span>
    </span>
  );
}
