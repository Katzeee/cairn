import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "./cn.js";

const breakpoints = ["initial", "md", "lg", "xl", "2xl"] as const;

export type Breakpoint = (typeof breakpoints)[number];
export type Responsive<T extends string> = T | Readonly<Partial<Record<Breakpoint, T>>>;
export type Space = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export type LayoutElement =
  | "div"
  | "span"
  | "section"
  | "article"
  | "header"
  | "footer"
  | "main"
  | "nav"
  | "aside"
  | "ul"
  | "ol"
  | "li";

// Utility classes are composed at runtime; styles.css safelists every class these tables can produce.
const spaceSteps: Readonly<Record<Space, string>> = {
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "6",
  "6": "8",
  "7": "10",
  "8": "12",
  "9": "16",
};

function responsive<T extends string>(value: Responsive<T> | undefined, toClass: (value: T) => string): string[] {
  if (value === undefined) {
    return [];
  }
  if (typeof value === "string") {
    return [toClass(value)];
  }
  return breakpoints.flatMap((breakpoint) => {
    const step = value[breakpoint];
    if (step === undefined) {
      return [];
    }
    return [breakpoint === "initial" ? toClass(step) : `${breakpoint}:${toClass(step)}`];
  });
}

const space = (prefix: string) => (step: Space) => `${prefix}-${spaceSteps[step]}`;

type SharedLayoutProps = Omit<HTMLAttributes<HTMLElement>, "className" | "style" | "color"> &
  Readonly<{
    children?: ReactNode;
    p?: Responsive<Space>;
    px?: Responsive<Space>;
    py?: Responsive<Space>;
    pt?: Responsive<Space>;
    pr?: Responsive<Space>;
    pb?: Responsive<Space>;
    pl?: Responsive<Space>;
    flexGrow?: Responsive<"0" | "1">;
    flexShrink?: Responsive<"0" | "1">;
    minWidth?: Responsive<"0">;
  }>;

function splitShared<P extends SharedLayoutProps>(properties: P) {
  const { p, px, py, pt, pr, pb, pl, flexGrow, flexShrink, minWidth, ...element } = properties;
  const classes = [
    ...responsive(p, space("p")),
    ...responsive(px, space("px")),
    ...responsive(py, space("py")),
    ...responsive(pt, space("pt")),
    ...responsive(pr, space("pr")),
    ...responsive(pb, space("pb")),
    ...responsive(pl, space("pl")),
    ...responsive(flexGrow, (value) => (value === "1" ? "grow" : "grow-0")),
    ...responsive(flexShrink, (value) => (value === "1" ? "shrink" : "shrink-0")),
    ...responsive(minWidth, () => "min-w-0"),
  ];
  return { classes, element };
}

const displays = {
  none: "hidden",
  inline: "inline",
  "inline-block": "inline-block",
  block: "block",
  contents: "contents",
  flex: "flex",
  "inline-flex": "inline-flex",
  grid: "grid",
  "inline-grid": "inline-grid",
} as const;

const alignments = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
  stretch: "items-stretch",
} as const;

const justifications = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const;

type Align = keyof typeof alignments;
type Justify = keyof typeof justifications;

type GapProps = Readonly<{ gap?: Responsive<Space>; gapX?: Responsive<Space>; gapY?: Responsive<Space> }>;

function gapClasses({ gap, gapX, gapY }: GapProps): string[] {
  return [
    ...responsive(gap, space("gap")),
    ...responsive(gapX, space("gap-x")),
    ...responsive(gapY, space("gap-y")),
  ];
}

export type BoxProps = SharedLayoutProps &
  Readonly<{ as?: LayoutElement; display?: Responsive<"none" | "inline" | "inline-block" | "block" | "contents"> }>;

export function Box({ as: Element = "div", display, ...properties }: BoxProps) {
  const { classes, element } = splitShared(properties);
  return <Element {...element} className={cn(responsive(display, (value) => displays[value]), classes)} />;
}

export type FlexProps = SharedLayoutProps &
  GapProps &
  Readonly<{
    as?: LayoutElement;
    align?: Responsive<Align>;
    direction?: Responsive<"row" | "column" | "row-reverse" | "column-reverse">;
    display?: Responsive<"none" | "inline-flex" | "flex">;
    justify?: Responsive<Justify>;
    wrap?: Responsive<"nowrap" | "wrap" | "wrap-reverse">;
  }>;

const directions = {
  row: "flex-row",
  column: "flex-col",
  "row-reverse": "flex-row-reverse",
  "column-reverse": "flex-col-reverse",
} as const;

export function Flex({
  as: Element = "div",
  align,
  direction,
  display = "flex",
  gap,
  gapX,
  gapY,
  justify,
  wrap,
  ...properties
}: FlexProps) {
  const { classes, element } = splitShared(properties);
  return (
    <Element
      {...element}
      className={cn(
        responsive(display, (value) => displays[value]),
        responsive(direction, (value) => directions[value]),
        responsive(align, (value) => alignments[value]),
        responsive(justify, (value) => justifications[value]),
        responsive(wrap, (value) => `flex-${value}`),
        gapClasses({ gap, gapX, gapY }),
        classes,
      )}
    />
  );
}

type Track = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type GridProps = SharedLayoutProps &
  GapProps &
  Readonly<{
    as?: LayoutElement;
    align?: Responsive<Align>;
    columns?: Responsive<Track>;
    display?: Responsive<"none" | "inline-grid" | "grid">;
    flow?: Responsive<"row" | "column" | "dense" | "row-dense" | "column-dense">;
    justify?: Responsive<Justify>;
    rows?: Responsive<Track>;
  }>;

const flows = {
  row: "grid-flow-row",
  column: "grid-flow-col",
  dense: "grid-flow-dense",
  "row-dense": "grid-flow-row-dense",
  "column-dense": "grid-flow-col-dense",
} as const;

export function Grid({
  as: Element = "div",
  align,
  columns,
  display = "grid",
  flow,
  gap,
  gapX,
  gapY,
  justify,
  rows,
  ...properties
}: GridProps) {
  const { classes, element } = splitShared(properties);
  return (
    <Element
      {...element}
      className={cn(
        responsive(display, (value) => displays[value]),
        responsive(columns, (value) => `grid-cols-${value}`),
        responsive(rows, (value) => `grid-rows-${value}`),
        responsive(flow, (value) => flows[value]),
        responsive(align, (value) => alignments[value]),
        responsive(justify, (value) => justifications[value]),
        gapClasses({ gap, gapX, gapY }),
        classes,
      )}
    />
  );
}

const containerWidths = {
  "1": "max-w-(--cairn-content-width-reading)",
  "2": "max-w-(--cairn-content-width-document)",
  "3": "max-w-(--cairn-content-width-standard)",
  "4": "max-w-(--cairn-content-width-wide)",
} as const;

const containerAlignments = { left: "mr-auto", center: "mx-auto", right: "ml-auto" } as const;

export type ContainerProps = SharedLayoutProps &
  Readonly<{ align?: keyof typeof containerAlignments; size?: Responsive<keyof typeof containerWidths> }>;

export function Container({ align = "center", size = "4", ...properties }: ContainerProps) {
  const { classes, element } = splitShared(properties);
  return (
    <div
      {...element}
      className={cn(
        "w-full",
        containerAlignments[align],
        responsive(size, (value) => containerWidths[value]),
        classes,
      )}
    />
  );
}

const sectionPaddings = { "1": "py-6", "2": "py-10", "3": "py-20", "4": "py-40" } as const;

export type SectionProps = SharedLayoutProps & Readonly<{ size?: Responsive<keyof typeof sectionPaddings> }>;

export function Section({ size = "3", ...properties }: SectionProps) {
  const { classes, element } = splitShared(properties);
  return (
    <section {...element} className={cn(responsive(size, (value) => sectionPaddings[value]), classes)} />
  );
}
