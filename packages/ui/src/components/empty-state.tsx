import type { ElementProps } from "./internal/element-props.js";

function Root(props: ElementProps<"div">) {
  return <div {...props} className="cairn-EmptyState" />;
}

function Illustration(props: ElementProps<"div">) {
  return <div {...props} aria-hidden className="cairn-EmptyStateIllustration" />;
}

function Title(props: ElementProps<"h3">) {
  return <h3 {...props} className="cairn-EmptyStateTitle" />;
}

function Description(props: ElementProps<"p">) {
  return <p {...props} className="cairn-EmptyStateDescription" />;
}

function Actions(props: ElementProps<"div">) {
  return <div {...props} className="cairn-EmptyStateActions" />;
}

export const EmptyState = Object.assign(Root, { Illustration, Title, Description, Actions });
