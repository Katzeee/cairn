import type { ElementProps } from "./element-props.js";

export function Link(properties: ElementProps<"a">) {
  return (
    <a
      {...properties}
      className="rounded-xs text-primary underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    />
  );
}
