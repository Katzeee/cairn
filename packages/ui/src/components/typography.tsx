import type { HTMLAttributes } from "react";

import type { ElementProps } from "./internal/element-props.js";
import { textToneAttribute, type TextRole, type TextTone, type Weight } from "./internal/variants.js";

type TypographyProps = Readonly<{
  size?: TextRole;
  weight?: Weight;
  tone?: TextTone;
  align?: "left" | "center" | "right";
  wrap?: "wrap" | "nowrap" | "pretty" | "balance";
  truncate?: boolean;
}>;

type NativeProps<T extends HTMLElement> = Omit<HTMLAttributes<T>, "className" | "style" | "color">;

function typographyAttributes({ size, weight, tone, align, wrap, truncate }: TypographyProps, base: string) {
  return {
    className: truncate ? `${base} cairn-Truncate` : base,
    "data-align": align,
    "data-size": size,
    "data-tone": textToneAttribute(tone),
    "data-weight": weight,
    "data-wrap": wrap,
  };
}

export type TextProps = NativeProps<HTMLElement> & TypographyProps & Readonly<{ as?: "span" | "div" | "label" | "p" }>;

export function Text({ as: Element = "span", size, weight, tone, align, wrap, truncate, ...props }: TextProps) {
  return <Element {...props} {...typographyAttributes({ size, weight, tone, align, wrap, truncate }, "cairn-Text")} />;
}

export type HeadingProps = NativeProps<HTMLHeadingElement> &
  TypographyProps &
  Readonly<{ as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }>;

export function Heading({ as: Element = "h2", size = "title", weight, tone, align, wrap, truncate, ...props }: HeadingProps) {
  return <Element {...props} {...typographyAttributes({ size, weight, tone, align, wrap, truncate }, "cairn-Heading")} />;
}

export type CodeProps = ElementProps<"code"> &
  Readonly<{
    // Lines of code or output set apart from prose, kept as written and scrolled sideways where they
    // are wider than the block.
    block?: boolean;
  }>;

export function Code({ block = false, ...props }: CodeProps) {
  if (!block) return <code {...props} className="cairn-Code" />;
  const { "aria-label": label, children, ...rest } = props;
  // The block scrolls, so it takes focus to be scrolled from the keyboard.
  return (
    <pre aria-label={label} className="cairn-CodeBlock" tabIndex={0}>
      <code {...rest}>{children}</code>
    </pre>
  );
}

export type KbdProps = ElementProps<"kbd">;

export function Kbd(props: KbdProps) {
  return <kbd {...props} className="cairn-Kbd" />;
}