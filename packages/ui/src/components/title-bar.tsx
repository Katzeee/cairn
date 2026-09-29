import type { ElementProps } from "./internal/element-props.js";
import { useWindowActive } from "./internal/window-active.js";

// The system draws the window controls; the title bar only keeps its content clear of them and
// marks itself as the window's drag region for hosts that move windows from script.
function Root(props: ElementProps<"div">) {
  const active = useWindowActive();
  return <div {...props} className="cairn-TitleBar" data-window-active={active} data-window-drag-region="" />;
}

function Leading(props: ElementProps<"div">) {
  return <div {...props} className="cairn-TitleBarLeading" />;
}

function Title(props: ElementProps<"span">) {
  return <span {...props} className="cairn-TitleBarTitle" />;
}

function Content(props: ElementProps<"div">) {
  return <div {...props} className="cairn-TitleBarContent" />;
}

function Trailing(props: ElementProps<"div">) {
  return <div {...props} className="cairn-TitleBarTrailing" />;
}

export const TitleBar = { Root, Leading, Title, Content, Trailing };
