import type { ReactNode } from "react";

import type { ElementProps } from "./internal/element-props.js";
import type { Tone } from "./internal/variants.js";

export type StatusProps = ElementProps<"span", "children"> &
  Readonly<{
    tone?: Tone;
    // The state in words. Without it the dot is decorative, so text beside it must name the state.
    children?: ReactNode;
  }>;

// The current state of a process or service, such as a connection or a job: a dot in the state's
// tone, and its name. It stays in place while the state lasts; Badge labels content instead.
export function Status({ tone = "neutral", children, ...props }: StatusProps) {
  return (
    <span {...props} className="cairn-Status" data-tone={tone}>
      <span aria-hidden className="cairn-StatusIndicator" />
      {children == null ? null : <span className="cairn-StatusLabel">{children}</span>}
    </span>
  );
}
