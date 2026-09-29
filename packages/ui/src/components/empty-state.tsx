import type { ElementProps } from "./internal/element-props.js";

export type EmptyStateTitleProps = ElementProps<"h2"> & Readonly<{ as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }>;

function Root({ children, ...props }: ElementProps<"div">) {
  return (
    <div {...props} className="cairn-EmptyState">
      <div className="cairn-EmptyStateContent">{children}</div>
    </div>
  );
}

function Illustration(props: ElementProps<"div">) {
  return <div {...props} aria-hidden className="cairn-EmptyStateIllustration" />;
}

function Title({ as: Element = "h2", ...props }: EmptyStateTitleProps) {
  return <Element {...props} className="cairn-EmptyStateTitle" />;
}

function Description(props: ElementProps<"p">) {
  return <p {...props} className="cairn-EmptyStateDescription" />;
}

function Actions(props: ElementProps<"div">) {
  return <div {...props} className="cairn-EmptyStateActions" />;
}

export const EmptyState = Object.assign(Root, { Illustration, Title, Description, Actions });
