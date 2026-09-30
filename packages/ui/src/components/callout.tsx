import { createContext, useContext, type ReactNode } from "react";

import { Button } from "./button.js";
import { Icon as Glyph, type IconGlyph } from "./icon.js";
import type { ElementProps } from "./internal/element-props.js";
import type { ActionPriority, Tone } from "./internal/variants.js";

// Given by AppShell.Banner: a callout there spans the content's top edge instead of sitting in a view.
export const BannerPlacement = createContext(false);

export type CalloutRootProps = ElementProps<"div"> & Readonly<{ tone?: Tone }>;

function Root({ tone = "neutral", role, children, ...props }: CalloutRootProps) {
  const banner = useContext(BannerPlacement);
  return (
    <div
      {...props}
      className="cairn-Callout"
      data-placement={banner ? "banner" : "view"}
      data-tone={tone}
      role={role ?? (tone === "danger" ? "alert" : "status")}
    >
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

// Steps that resolve the condition, as Callout.Action. Where the callout has room they follow the text
// with the primary last, at the trailing edge; where it does not they sit below the text with the
// primary first, where the reader's eye returns.
function Actions({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="cairn-CalloutActions">{children}</div>;
}

export type CalloutActionProps = Readonly<{
  label: string;
  icon?: IconGlyph;
  onSelect: () => void;
  // A callout emphasizes its primary action; it has no overflow for secondary ones.
  priority?: Exclude<ActionPriority, "secondary">;
  disabled?: boolean;
}>;

function Action({ label, icon, onSelect, priority = "default", disabled }: CalloutActionProps) {
  return (
    <span className="cairn-CalloutAction" data-priority={priority}>
      <Button disabled={disabled} onClick={onSelect} size="sm" variant={priority === "primary" ? "outline" : "ghost"}>
        {icon === undefined ? null : <Glyph glyph={icon} size="sm" />}
        {label}
      </Button>
    </span>
  );
}

export const Callout = { Root, Icon, Body, Title, Text, Actions, Action };
