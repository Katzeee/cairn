import { Select as BaseSelect } from "@base-ui/react/select";
import { Children, createContext, isValidElement, useContext, type ReactNode } from "react";

import { Icon } from "./icon.js";
import type { ElementProps } from "./internal/element-props.js";
import { usePortalContainer } from "./internal/portal-container.js";
import type { ControlSize } from "./internal/variants.js";

const SizeContext = createContext<ControlSize>("md");

export type SelectRootProps = Readonly<{
  children: ReactNode;
  size?: ControlSize;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
}>;

export type SelectTriggerProps = ElementProps<"button", "children"> &
  Readonly<{ placeholder?: string; invalid?: boolean }>;

export type SelectContentProps = Readonly<{ children: ReactNode }>;

export type SelectItemProps = Readonly<{ value: string; disabled?: boolean; children: ReactNode }>;

// Base UI renders the selected label from this list before the popup ever mounts.
function collectItems(children: ReactNode): { label: ReactNode; value: string }[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child)) return [];
    if (child.type === Item) {
      const { children: label, value } = child.props as SelectItemProps;
      return [{ label, value }];
    }
    return collectItems((child.props as { children?: ReactNode }).children);
  });
}

function Root({ size = "md", children, onValueChange, ...props }: SelectRootProps) {
  return (
    <SizeContext.Provider value={size}>
      <BaseSelect.Root
        {...props}
        items={collectItems(children)}
        onValueChange={onValueChange === undefined ? undefined : (value) => onValueChange(String(value))}
      >
        {children}
      </BaseSelect.Root>
    </SizeContext.Provider>
  );
}

function Trigger({ placeholder, invalid, ...props }: SelectTriggerProps) {
  return (
    <BaseSelect.Trigger
      {...props}
      className="cairn-Input cairn-SelectTrigger cairn-HitArea"
      data-invalid={invalid || undefined}
      data-size={useContext(SizeContext)}
    >
      <BaseSelect.Value className="cairn-SelectValue" placeholder={placeholder} />
      <BaseSelect.Icon className="cairn-SelectIcon">
        <Icon name="chevron-down" size="sm" />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

function Content({ children }: SelectContentProps) {
  const { anchorRef, container } = usePortalContainer();
  return (
    <>
      <span hidden ref={anchorRef} />
      <BaseSelect.Portal container={container}>
        <BaseSelect.Positioner alignItemWithTrigger={false} className="cairn-Positioner" sideOffset={6}>
          <BaseSelect.Popup className="cairn-Popup" data-list="">
            {children}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </>
  );
}

function Item({ value, disabled, children }: SelectItemProps) {
  return (
    <BaseSelect.Item className="cairn-PopupItem" data-indicator="" disabled={disabled} value={value}>
      <BaseSelect.ItemIndicator className="cairn-PopupItemIndicator">
        <Icon name="check" size="sm" />
      </BaseSelect.ItemIndicator>
      <BaseSelect.ItemText className="cairn-PopupItemText">{children}</BaseSelect.ItemText>
    </BaseSelect.Item>
  );
}

function Group({ children }: Readonly<{ children: ReactNode }>) {
  return <BaseSelect.Group>{children}</BaseSelect.Group>;
}

function Label({ children }: Readonly<{ children: ReactNode }>) {
  return <BaseSelect.GroupLabel className="cairn-PopupLabel">{children}</BaseSelect.GroupLabel>;
}

function Separator() {
  return <BaseSelect.Separator className="cairn-PopupSeparator" />;
}

export const Select = { Root, Trigger, Content, Item, Group, Label, Separator };
