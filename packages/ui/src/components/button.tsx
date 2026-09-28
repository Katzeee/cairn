import { Button as BaseButton } from "@base-ui/react/button";

import type { ElementProps } from "./internal/element-props.js";
import type { ControlSize } from "./internal/variants.js";
import { Spinner } from "./spinner.js";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";

export type ButtonProps = ElementProps<"button"> &
  Readonly<{
    variant?: ButtonVariant;
    size?: ControlSize;
    loading?: boolean;
  }>;

export type IconButtonProps = ButtonProps & Readonly<{ "aria-label": string }>;

function ButtonBase({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  ...props
}: ButtonProps & Readonly<{ icon?: boolean }>) {
  return (
    <BaseButton
      {...props}
      aria-busy={loading || undefined}
      className="cairn-Button cairn-Focusable"
      data-icon={icon ? "" : undefined}
      data-size={size}
      data-variant={variant}
      disabled={loading || props.disabled}
      focusableWhenDisabled={loading}
    >
      {loading && !icon ? <Spinner size={size === "lg" ? "md" : "sm"} /> : null}
      {loading && icon ? <Spinner size={size === "lg" ? "md" : "sm"} /> : children}
    </BaseButton>
  );
}

export function Button(props: ButtonProps) {
  return <ButtonBase {...props} />;
}

export function IconButton(props: IconButtonProps) {
  return <ButtonBase {...props} icon />;
}
