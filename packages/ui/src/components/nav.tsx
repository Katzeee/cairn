import type { IconName } from "@cairn/design-system-catalog";
import type { ReactNode } from "react";

import { cn } from "./cn.js";
import type { ElementProps } from "./element-props.js";
import { Icon } from "./icon.js";
import { Tooltip } from "./tooltip.js";

const activeClasses = "bg-accent text-accent-foreground";
const idleClasses = "text-muted-foreground hover:bg-accent/60 hover:text-foreground";

export type NavItemProps = ElementProps<"a"> &
  Readonly<{ active?: boolean; icon?: IconName; decoration?: ReactNode }>;

export function NavItem({ active = false, children, icon, decoration, ...properties }: NavItemProps) {
  return (
    <a
      {...properties}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded-sm px-2.5 py-1.5 text-label font-medium transition-colors",
        active ? activeClasses : idleClasses,
      )}
    >
      {decoration ?? (icon === undefined ? null : <Icon name={icon} size="sm" />)}
      {children}
    </a>
  );
}

export type NavRailItemProps = ElementProps<"a"> &
  Readonly<{ active?: boolean; icon?: IconName; decoration?: ReactNode; label: string }>;

export function NavRailItem({
  active = false,
  icon,
  decoration,
  label,
  ...properties
}: NavRailItemProps) {
  return (
    <Tooltip content={label}>
      <a
        {...properties}
        aria-current={active ? "page" : undefined}
        aria-label={label}
        className={cn(
          "grid size-10 place-items-center rounded-md transition-colors",
          active ? activeClasses : idleClasses,
        )}
      >
        {decoration ?? (icon === undefined ? null : <Icon name={icon} />)}
      </a>
    </Tooltip>
  );
}

export function NavSectionLabel({ children }: Readonly<{ children: ReactNode }>) {
  return <p className="mb-2 text-caption font-semibold tracking-widest text-muted-foreground uppercase">{children}</p>;
}
