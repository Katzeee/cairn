import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { Check, ChevronDown } from "lucide-react";
import { useRef, type MouseEvent } from "react";

import { Icon } from "./icon.js";
import { usePortalContainer } from "./internal/portal-container.js";
import type { ControlSize } from "./internal/variants.js";

export type ComboboxOption = Readonly<{ label: string; value: string; disabled?: boolean }>;

export type ComboboxProps = Readonly<{
  items: readonly ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  name?: string;
  placeholder?: string;
  emptyLabel?: string;
  size?: ControlSize;
  "aria-label"?: string;
}>;

export function Combobox({
  items,
  value,
  defaultValue,
  onValueChange,
  disabled,
  readOnly,
  invalid,
  placeholder,
  emptyLabel = "No matches found.",
  size = "md",
  "aria-label": ariaLabel,
  ...props
}: ComboboxProps) {
  const selected = (key: string | null | undefined) => items.find((item) => item.value === key) ?? null;
  const input = useRef<HTMLInputElement>(null);
  const { anchorRef, container } = usePortalContainer();
  const focusInput = (event: MouseEvent<HTMLDivElement>) => {
    if (!disabled && !(event.target as Element).closest("button")) input.current?.focus();
  };
  return (
    <BaseCombobox.Root
      {...props}
      defaultValue={selected(defaultValue)}
      disabled={disabled}
      isItemEqualToValue={(item, next) => item.value === next.value}
      itemToStringLabel={(item) => item.label}
      itemToStringValue={(item) => item.value}
      items={items}
      onValueChange={onValueChange === undefined ? undefined : (next) => onValueChange(next?.value ?? null)}
      readOnly={readOnly}
      value={value === undefined ? undefined : selected(value)}
    >
      <div
        className="cairn-Input cairn-HitArea"
        data-disabled={disabled || undefined}
        data-invalid={invalid || undefined}
        data-readonly={readOnly || undefined}
        data-size={size}
        data-ui="input-hit-area"
        onClick={focusInput}
        ref={anchorRef}
      >
        <BaseCombobox.Input
          aria-invalid={invalid || undefined}
          aria-label={ariaLabel}
          className="cairn-InputControl"
          placeholder={placeholder}
          ref={input}
        />
        <BaseCombobox.Trigger aria-label="Open options" className="cairn-ComboboxTrigger" tabIndex={-1}>
          <Icon glyph={ChevronDown} size="sm" />
        </BaseCombobox.Trigger>
      </div>
      <BaseCombobox.Portal container={container}>
        <BaseCombobox.Positioner className="cairn-Positioner" sideOffset={6}>
          <BaseCombobox.Popup className="cairn-Popup" data-list="">
            <BaseCombobox.Empty className="cairn-PopupEmpty">{emptyLabel}</BaseCombobox.Empty>
            <BaseCombobox.List>
              {(option: ComboboxOption) => (
                <BaseCombobox.Item
                  className="cairn-PopupItem"
                  data-indicator=""
                  disabled={option.disabled}
                  key={option.value}
                  value={option}
                >
                  <BaseCombobox.ItemIndicator className="cairn-PopupItemIndicator">
                    <Icon glyph={Check} size="sm" />
                  </BaseCombobox.ItemIndicator>
                  <span className="cairn-PopupItemText">{option.label}</span>
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  );
}
