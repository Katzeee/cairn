import type { ReactNode } from "react";

import { FlushMedia } from "./image.js";
import type { ElementProps } from "./internal/element-props.js";
import type { ControlSize } from "./internal/variants.js";

export type CardVariant = "surface" | "muted";

export type CardProps = ElementProps<"div", "ref"> &
  Readonly<{
    as?: "div" | "article" | "section";
    variant?: CardVariant;
    size?: ControlSize;
  }>;

function Root({ as: Element = "div", variant = "surface", size = "md", ...props }: CardProps) {
  return <Element {...props} className="cairn-Card" data-size={size} data-variant={variant} />;
}

export type CardLinkProps = ElementProps<"a", "children"> & Readonly<{ children: ReactNode }>;

// The card's destination, usually its title. The whole card opens it, while the link's own text stays
// its accessible name and other controls in the card keep their own clicks and focus.
function Link(props: CardLinkProps) {
  return <a {...props} className="cairn-CardLink" />;
}

// Media drawn to the card's edges, such as a picture above its content. Place it first or last.
function Media({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="cairn-CardMedia">
      <FlushMedia.Provider value>{children}</FlushMedia.Provider>
    </div>
  );
}

export const Card = Object.assign(Root, { Link, Media });
