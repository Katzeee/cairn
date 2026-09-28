import { Menu } from "@base-ui/react/menu";
import type { ReactNode } from "react";

import { Icon } from "../icon.js";

export type MenuItemProps = Readonly<{
  children: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
  shortcut?: string;
}>;

export type MenuCheckboxItemProps = Readonly<{
  children: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  shortcut?: string;
}>;

export type MenuRadioGroupProps = Readonly<{
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}>;

export type MenuRadioItemProps = Readonly<{ children: ReactNode; value: string; disabled?: boolean }>;

function Shortcut({ keys }: Readonly<{ keys: string | undefined }>) {
  if (keys === undefined) return null;
  return (
    <span aria-hidden className="cairn-PopupItemTrailing">
      {keys}
    </span>
  );
}

export function Item({ children, onSelect, disabled, variant = "default", shortcut }: MenuItemProps) {
  return (
    <Menu.Item className="cairn-PopupItem" data-variant={variant} disabled={disabled} onClick={onSelect}>
      {children}
      <Shortcut keys={shortcut} />
    </Menu.Item>
  );
}

export function CheckboxItem({ children, shortcut, onCheckedChange, ...props }: MenuCheckboxItemProps) {
  return (
    <Menu.CheckboxItem
      {...props}
      className="cairn-PopupItem"
      data-indicator=""
      onCheckedChange={onCheckedChange === undefined ? undefined : (checked) => onCheckedChange(checked)}
    >
      <Menu.CheckboxItemIndicator className="cairn-PopupItemIndicator">
        <Icon name="check" size="sm" />
      </Menu.CheckboxItemIndicator>
      <span className="cairn-PopupItemText">{children}</span>
      <Shortcut keys={shortcut} />
    </Menu.CheckboxItem>
  );
}

export function RadioGroup({ children, onValueChange, ...props }: MenuRadioGroupProps) {
  return (
    <Menu.RadioGroup
      {...props}
      onValueChange={onValueChange === undefined ? undefined : (value) => onValueChange(String(value))}
    >
      {children}
    </Menu.RadioGroup>
  );
}

export function RadioItem({ children, value, disabled }: MenuRadioItemProps) {
  return (
    <Menu.RadioItem className="cairn-PopupItem" data-indicator="" disabled={disabled} value={value}>
      <Menu.RadioItemIndicator className="cairn-PopupItemIndicator">
        <Icon name="check" size="sm" />
      </Menu.RadioItemIndicator>
      <span className="cairn-PopupItemText">{children}</span>
    </Menu.RadioItem>
  );
}

export function Label({ children }: Readonly<{ children: ReactNode }>) {
  return <Menu.GroupLabel className="cairn-PopupLabel">{children}</Menu.GroupLabel>;
}

export function Group({ children }: Readonly<{ children: ReactNode }>) {
  return <Menu.Group>{children}</Menu.Group>;
}

export function Separator() {
  return <Menu.Separator className="cairn-PopupSeparator" />;
}

export function Sub({ children }: Readonly<{ children: ReactNode }>) {
  return <Menu.SubmenuRoot>{children}</Menu.SubmenuRoot>;
}

export function SubTrigger({ children, disabled }: Readonly<{ children: ReactNode; disabled?: boolean }>) {
  return (
    <Menu.SubmenuTrigger className="cairn-PopupItem" disabled={disabled}>
      {children}
      <span aria-hidden className="cairn-PopupItemTrailing">
        <Icon name="chevron-right" size="xs" />
      </span>
    </Menu.SubmenuTrigger>
  );
}
