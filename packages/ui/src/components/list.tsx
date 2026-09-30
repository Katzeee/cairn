import { Field as BaseField } from "@base-ui/react/field";
import { ChevronRight } from "lucide-react";
import { createContext, useContext, useId, type ReactNode } from "react";

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

// Rows inside a section sit on its grouped surface.
const InSection = createContext(false);

export type ListSectionProps = Readonly<{
  title?: ReactNode;
  // Explains the group or the consequence of its actions, below the rows.
  description?: ReactNode;
  children?: ReactNode;
}>;

// A titled group of rows on one surface, like a settings group or the properties of a record. Sections
// stack in their parent's gap.
function Section({ title, description, children }: ListSectionProps) {
  const titleId = useId();
  return (
    <section aria-labelledby={title == null ? undefined : titleId} className="cairn-ListSection">
      {title == null ? null : (
        <h2 className="cairn-ListSectionTitle" id={titleId}>
          {title}
        </h2>
      )}
      <InSection.Provider value>
        <ul className="cairn-ListSectionRows" role="list">
          {children}
        </ul>
      </InSection.Provider>
      {description == null ? null : <p className="cairn-ListSectionDescription">{description}</p>}
    </section>
  );
}

export type ListItemProps = ElementProps<"button", "type" | "children"> &
  Readonly<{
    children: ReactNode;
    description?: ReactNode;
    // Content at the trailing edge: supporting text such as a date or a count, a value, a status, or
    // an action of its own.
    trailing?: ReactNode;
    // A control the row labels, such as a select or a switch; the title and description describe it.
    control?: ReactNode;
    icon?: IconGlyph;
    // Leads to another page; the row shows that it goes onward.
    href?: string;
    // The item whose detail is shown.
    selected?: boolean;
  }>;

// A row that acts has onClick or href; otherwise it states something, or labels its control. In a
// list-detail list, choosing an item opens its detail. Beside the detail the selected item is marked;
// where the detail replaces the list, items lead onward with a chevron instead, as links always do.
function Item({ children, description, trailing, control, icon, href, selected = false, onClick, ...props }: ListItemProps) {
  const pane = useContext(ListPane);
  const grouped = useContext(InSection);
  const onward = href !== undefined || pane?.layout === "stack";
  const marked = selected && !onward;
  const leading = icon === undefined ? null : <Icon glyph={icon} size="sm" />;
  const end = trailing == null ? null : <span className="cairn-ListItemTrailing">{trailing}</span>;

  if (control !== undefined) {
    return (
      <li className="cairn-ListItem" data-grouped={grouped || undefined}>
        <BaseField.Root className="cairn-ListItemRow" disabled={props.disabled}>
          {leading}
          <span className="cairn-ListItemText">
            <BaseField.Label className="cairn-ListItemTitle">{children}</BaseField.Label>
            {description == null ? null : (
              <BaseField.Description className="cairn-ListItemDescription">{description}</BaseField.Description>
            )}
          </span>
          {end}
          <span className="cairn-ListItemControl">{control}</span>
        </BaseField.Root>
      </li>
    );
  }

  const content = (
    <>
      {leading}
      <span className="cairn-ListItemText">
        <span className="cairn-ListItemTitle">{children}</span>
        {description == null ? null : <span className="cairn-ListItemDescription">{description}</span>}
      </span>
      {end}
      {onward && (href !== undefined || onClick !== undefined) ? <Icon glyph={ChevronRight} size="sm" /> : null}
    </>
  );

  if (href !== undefined) {
    const { disabled, ...rest } = props;
    return (
      <li className="cairn-ListItem" data-grouped={grouped || undefined}>
        <a
          {...(rest as ElementProps<"a">)}
          aria-current={selected ? "page" : undefined}
          aria-disabled={disabled || undefined}
          className="cairn-ListItemRow cairn-ListItemAction cairn-Focusable"
          href={disabled ? undefined : href}
          onClick={(event) => {
            onClick?.(event as unknown as Parameters<NonNullable<typeof onClick>>[0]);
            if (!event.defaultPrevented) pane?.showDetail();
          }}
        >
          {content}
        </a>
      </li>
    );
  }

  if (onClick === undefined) {
    const { disabled, ...rest } = props;
    return (
      <li className="cairn-ListItem" data-grouped={grouped || undefined}>
        <div {...(rest as ElementProps<"div">)} aria-disabled={disabled || undefined} className="cairn-ListItemRow">
          {content}
        </div>
      </li>
    );
  }

  return (
    <li className="cairn-ListItem" data-grouped={grouped || undefined}>
      <button
        {...props}
        aria-current={marked ? "true" : undefined}
        className="cairn-ListItemRow cairn-ListItemAction cairn-Focusable"
        onClick={(event) => {
          onClick(event);
          if (!event.defaultPrevented) pane?.showDetail();
        }}
        type="button"
      >
        {content}
      </button>
    </li>
  );
}

export const List = { Root, Section, Item };
