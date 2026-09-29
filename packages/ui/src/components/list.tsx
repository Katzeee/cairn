import { ChevronRight } from "lucide-react";
import { useContext, type ReactNode } from "react";

import { Icon, type IconGlyph } from "./icon.js";
import type { ElementProps } from "./internal/element-props.js";
import { ListPane } from "./list-detail.js";

export type ListRootProps = Readonly<{
  // Names the list when the region around it does not.
  label?: string;
  children: ReactNode;
}>;

function Root({ label, children }: ListRootProps) {
  return (
    <ul aria-label={label} className="cairn-List" role="list">
      {children}
    </ul>
  );
}

export type ListItemProps = ElementProps<"button", "type" | "children"> &
  Readonly<{
    children: ReactNode;
    description?: ReactNode;
    // Supporting text at the trailing edge, such as a date or a count.
    trailing?: ReactNode;
    icon?: IconGlyph;
    // The item whose detail is shown.
    selected?: boolean;
  }>;

// In a list-detail list, choosing an item opens its detail. Beside the detail the selected item is
// marked; where the detail replaces the list, items lead onward with a chevron instead.
function Item({ children, description, trailing, icon, selected = false, onClick, ...props }: ListItemProps) {
  const pane = useContext(ListPane);
  const onward = pane?.layout === "stack";
  const marked = selected && !onward;
  return (
    <li className="cairn-ListItem">
      <button
        {...props}
        aria-current={marked ? "true" : undefined}
        className="cairn-ListItemButton cairn-Focusable"
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) pane?.showDetail();
        }}
        type="button"
      >
        {icon === undefined ? null : <Icon glyph={icon} size="sm" />}
        <span className="cairn-ListItemText">
          <span className="cairn-ListItemTitle">{children}</span>
          {description == null ? null : <span className="cairn-ListItemDescription">{description}</span>}
        </span>
        {trailing == null ? null : <span className="cairn-ListItemTrailing">{trailing}</span>}
        {onward ? <Icon glyph={ChevronRight} size="sm" /> : null}
      </button>
    </li>
  );
}

export const List = { Root, Item };
