import type { ElementProps } from "./internal/element-props.js";
import type { Tone } from "./internal/variants.js";

export type CalloutRootProps = ElementProps<"div"> & Readonly<{ tone?: Tone }>;

function Root({ tone = "neutral", role, children, ...props }: CalloutRootProps) {
  return (
    <div {...props} className="cairn-Callout" data-tone={tone} role={role ?? (tone === "danger" ? "alert" : "status")}>
      {children}
    </div>
  );
}

function Icon(props: ElementProps<"div">) {
  return <div {...props} aria-hidden className="cairn-CalloutIcon" />;
}

function Body(props: ElementProps<"div">) {
  return <div {...props} className="cairn-CalloutBody" />;
}

function Title(props: ElementProps<"p">) {
  return <p {...props} className="cairn-CalloutTitle" />;
}

function Text(props: ElementProps<"p">) {
  return <p {...props} className="cairn-CalloutText" />;
}

export const Callout = { Root, Icon, Body, Title, Text };
