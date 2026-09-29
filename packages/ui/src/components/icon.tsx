import type { ComponentType } from "react";

// The props Icon passes, which the glyph forwards to its svg. Typed without React's SVG props so a
// glyph built against another copy of React's types still fits.
export type IconGlyphProps = Readonly<{
  className?: string;
  "data-size"?: string;
  role?: "img";
  "aria-hidden"?: "true";
  "aria-label"?: string;
}>;

// Any SVG icon component, such as those of lucide-react, Heroicons, Phosphor, or Tabler, or one the
// application draws itself.
export type IconGlyph = ComponentType<IconGlyphProps>;

export type IconProps = Readonly<{
  glyph: IconGlyph;
  size?: "xs" | "sm" | "md" | "lg";
  label?: string;
}>;

export function Icon({ glyph: Glyph, size = "md", label }: IconProps) {
  return (
    <Glyph
      aria-hidden={label === undefined ? "true" : undefined}
      aria-label={label}
      className="cairn-Icon"
      data-size={size}
      role={label === undefined ? undefined : "img"}
    />
  );
}
