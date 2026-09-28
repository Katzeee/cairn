import type { ElementProps } from "./internal/element-props.js";

export type LinkProps = ElementProps<"a"> & Readonly<{ underline?: "always" | "hover" }>;

export function Link({ underline = "always", ...props }: LinkProps) {
  return <a {...props} className="cairn-Link cairn-Focusable" data-underline={underline} />;
}
