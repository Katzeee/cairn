import type { ReactNode } from "react";

import { Icon, type IconName } from "./icon.js";
import type { ElementProps } from "./internal/element-props.js";
import { Tooltip } from "./tooltip.js";

export type NavItemProps = ElementProps<"a"> & Readonly<{ active?: boolean; icon?: IconName; decoration?: ReactNode }>;

export function NavItem({ active = false, icon, decoration, children, ...props }: NavItemProps) {
  return (
    <a {...props} aria-current={active ? "page" : undefined} className="cairn-NavItem cairn-Focusable">
      {decoration ?? (icon === undefined ? null : <Icon name={icon} size="sm" />)}
      {children}
    </a>
  );
}

export type NavRailItemProps = ElementProps<"a", "children"> &
  Readonly<{ active?: boolean; icon?: IconName; decoration?: ReactNode; label: string }>;

export function NavRailItem({ active = false, icon, decoration, label, ...props }: NavRailItemProps) {
  return (
    <Tooltip content={label} side="right">
      <a
        {...props}
        aria-current={active ? "page" : undefined}
        aria-label={label}
        className="cairn-NavRailItem cairn-Focusable"
      >
        {decoration ?? (icon === undefined ? null : <Icon name={icon} />)}
      </a>
    </Tooltip>
  );
}

export function NavSectionLabel({ children }: Readonly<{ children: ReactNode }>) {
  return <p className="cairn-NavSectionLabel">{children}</p>;
}
