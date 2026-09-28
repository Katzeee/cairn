import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export const breakpoints = ["initial", "xs", "sm", "md", "lg", "xl"] as const;
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

export function responsiveClasses<T extends string>(name: string, value: Responsive<T> | undefined): string[] {
  if (value === undefined) return [];
  if (typeof value === "string") return [`cairn-r-${name}-${value.replace("%", "p")}`];
  return breakpoints.flatMap((point) =>
    value[point] === undefined
      ? []
      : [`${point === "initial" ? "" : `${point}:`}cairn-r-${name}-${value[point].replace("%", "p")}`],
  );
}

type NativeProps = Omit<HTMLAttributes<HTMLElement>, "className" | "style" | "color"> &
  Readonly<{ children?: ReactNode }>;
type LayoutProps = NativeProps &
  Readonly<{
    p?: Responsive<string>;
    px?: Responsive<string>;
    py?: Responsive<string>;
    pt?: Responsive<string>;
    pr?: Responsive<string>;
    pb?: Responsive<string>;
    pl?: Responsive<string>;
    width?: Responsive<string>;
    minWidth?: Responsive<string>;
    maxWidth?: Responsive<string>;
    height?: Responsive<string>;
    minHeight?: Responsive<string>;
    maxHeight?: Responsive<string>;
    position?: Responsive<"static" | "relative" | "absolute" | "fixed" | "sticky">;
    overflow?: Responsive<"visible" | "hidden" | "clip" | "scroll" | "auto">;
    overflowX?: Responsive<"visible" | "hidden" | "clip" | "scroll" | "auto">;
    overflowY?: Responsive<"visible" | "hidden" | "clip" | "scroll" | "auto">;
    inset?: Responsive<string>;
    top?: Responsive<string>;
    right?: Responsive<string>;
    bottom?: Responsive<string>;
    left?: Responsive<string>;
    flexBasis?: Responsive<string>;
    flexGrow?: Responsive<string>;
    flexShrink?: Responsive<string>;
    gridArea?: Responsive<string>;
    gridColumn?: Responsive<string>;
    gridColumnStart?: Responsive<string>;
    gridColumnEnd?: Responsive<string>;
    gridRow?: Responsive<string>;
    gridRowStart?: Responsive<string>;
    gridRowEnd?: Responsive<string>;
    alignSelf?: Responsive<"start" | "center" | "end" | "baseline" | "stretch">;
    justifySelf?: Responsive<"start" | "center" | "end" | "baseline" | "stretch">;
  }>;

const layoutNames = {
  p: "p",
  px: "px",
  py: "py",
  pt: "pt",
  pr: "pr",
  pb: "pb",
  pl: "pl",
  width: "w",
  minWidth: "min-w",
  maxWidth: "max-w",
  height: "h",
  minHeight: "min-h",
  maxHeight: "max-h",
  position: "position",
  overflow: "overflow",
  overflowX: "ox",
  overflowY: "oy",
  inset: "inset",
  top: "top",
  right: "right",
  bottom: "bottom",
  left: "left",
  flexBasis: "fb",
  flexGrow: "fg",
  flexShrink: "fs",
  gridArea: "ga",
  gridColumn: "gc",
  gridColumnStart: "gcs",
  gridColumnEnd: "gce",
  gridRow: "gr",
  gridRowStart: "grs",
  gridRowEnd: "gre",
  alignSelf: "as",
  justifySelf: "js",
} as const;

const customNames = new Set([
  "p",
  "px",
  "py",
  "pt",
  "pr",
  "pb",
  "pl",
  "w",
  "min-w",
  "max-w",
  "h",
  "min-h",
  "max-h",
  "inset",
  "top",
  "right",
  "bottom",
  "left",
  "fb",
  "fg",
  "fs",
  "ga",
  "gc",
  "gcs",
  "gce",
  "gr",
  "grs",
  "gre",
]);
const spaces = new Set<string>(Array.from({ length: 10 }, (_, index) => String(index)));
const edges = new Set<string>([...spaces, ...Array.from({ length: 9 }, (_, index) => `-${index + 1}`)]);

export function customResponsive(name: string, value: Responsive<string> | undefined, style: Record<string, string>) {
  if (value === undefined) return [];
  const entries = typeof value === "string" ? [["initial", value]] : Object.entries(value);
  return entries.map(([point, step]) => {
    if (step === undefined) return "";
    const spaceStep = ["p", "px", "py", "pt", "pr", "pb", "pl", "gap", "cg", "rg"].includes(name) && spaces.has(step);
    const edgeStep = ["inset", "top", "right", "bottom", "left"].includes(name) && edges.has(step);
    const flexStep = ["fg", "fs"].includes(name) && (step === "0" || step === "1");
    if (spaceStep || edgeStep || flexStep) {
      return `${point === "initial" ? "" : `${point}:`}cairn-r-${name}-${step}`;
    }
    style[`--${name}${point === "initial" ? "" : `-${point}`}`] = step;
    return `${point === "initial" ? "" : `${point}:`}cairn-r-${name}`;
  });
}

function splitLayout(props: LayoutProps) {
  const element: Record<string, unknown> = {};
  const classes: string[] = [];
  const style: Record<string, string> = {};
  for (const [key, value] of Object.entries(props)) {
    if (key in layoutNames) {
      const name = layoutNames[key as keyof typeof layoutNames];
      classes.push(
        ...(customNames.has(name)
          ? customResponsive(name, value as Responsive<string>, style)
          : responsiveClasses(name, value as Responsive<string>)),
      );
    } else {
      element[key] = value;
    }
  }
  return { element, classes, style: style as CSSProperties };
}

type Display = "none" | "inline" | "inline-block" | "block" | "contents";
export type BoxProps = LayoutProps & Readonly<{ as?: LayoutElement; display?: Responsive<Display> }>;
export function Box({ as: Element = "div", display, ...props }: BoxProps) {
  const { element, classes, style } = splitLayout(props);
  return (
    <Element
      {...element}
      style={style}
      className={["cairn-Box", ...responsiveClasses("display", display), ...classes].join(" ")}
    />
  );
}

type GapProps = Readonly<{ gap?: Responsive<string>; gapX?: Responsive<string>; gapY?: Responsive<string> }>;
type Align = "start" | "center" | "end" | "baseline" | "stretch";
type Justify = "start" | "center" | "end" | "between";
export type FlexProps = LayoutProps &
  GapProps &
  Readonly<{
    as?: LayoutElement;
    display?: Responsive<"none" | "inline-flex" | "flex">;
    direction?: Responsive<"row" | "column" | "row-reverse" | "column-reverse">;
    align?: Responsive<Align>;
    justify?: Responsive<Justify>;
    wrap?: Responsive<"nowrap" | "wrap" | "wrap-reverse">;
  }>;
export function Flex({
  as: Element = "div",
  display,
  direction,
  align,
  justify,
  wrap,
  gap,
  gapX,
  gapY,
  ...props
}: FlexProps) {
  const { element, classes, style } = splitLayout(props);
  return (
    <Element
      {...element}
      style={style}
      className={[
        "cairn-Flex",
        ...responsiveClasses("display", display),
        ...responsiveClasses("fd", direction),
        ...responsiveClasses("ai", align),
        ...responsiveClasses("jc", justify),
        ...responsiveClasses("fw", wrap),
        ...customResponsive("gap", gap, style as Record<string, string>),
        ...customResponsive("cg", gapX, style as Record<string, string>),
        ...customResponsive("rg", gapY, style as Record<string, string>),
        ...classes,
      ].join(" ")}
    />
  );
}

export type GridProps = LayoutProps &
  GapProps &
  Readonly<{
    as?: LayoutElement;
    display?: Responsive<"none" | "inline-grid" | "grid">;
    areas?: Responsive<string>;
    columns?: Responsive<string>;
    rows?: Responsive<string>;
    flow?: Responsive<"row" | "column" | "dense" | "row-dense" | "column-dense">;
    align?: Responsive<Align>;
    justify?: Responsive<Justify>;
    alignContent?: Responsive<Align | "between" | "around" | "evenly">;
    justifyItems?: Responsive<Align>;
  }>;
export function Grid({
  as: Element = "div",
  display,
  areas,
  columns,
  rows,
  flow,
  align,
  justify,
  alignContent,
  justifyItems,
  gap,
  gapX,
  gapY,
  ...props
}: GridProps) {
  const { element, classes, style } = splitLayout(props);
  const gridClasses = (name: string, value: Responsive<string> | undefined) => {
    if (value === undefined) return [];
    const entries = typeof value === "string" ? [["initial", value]] : Object.entries(value);
    return entries.map(([point, step]) => {
      if (step === undefined) return "";
      if ((name === "gtc" || name === "gtr") && /^[1-9]$/.test(step)) {
        return `${point === "initial" ? "" : `${point}:`}cairn-r-${name}-${step}`;
      }
      (style as Record<string, string>)[`--${name}${point === "initial" ? "" : `-${point}`}`] = step;
      return `${point === "initial" ? "" : `${point}:`}cairn-r-${name}`;
    });
  };
  return (
    <Element
      {...element}
      style={style}
      className={[
        "cairn-Grid",
        ...responsiveClasses("display", display),
        ...gridClasses("gta", areas),
        ...gridClasses("gtc", columns),
        ...gridClasses("gtr", rows),
        ...responsiveClasses("gaf", flow),
        ...responsiveClasses("ai", align),
        ...responsiveClasses("jc", justify),
        ...responsiveClasses("ac", alignContent),
        ...responsiveClasses("ji", justifyItems),
        ...customResponsive("gap", gap, style as Record<string, string>),
        ...customResponsive("cg", gapX, style as Record<string, string>),
        ...customResponsive("rg", gapY, style as Record<string, string>),
        ...classes,
      ].join(" ")}
    />
  );
}

type BlockDisplay = Responsive<"none" | "initial">;

function displayAs(display: BlockDisplay | undefined, shown: "flex" | "block") {
  if (display === undefined || typeof display === "string") return display === "initial" ? shown : display;
  return Object.fromEntries(
    Object.entries(display).map(([point, value]) => [point, value === "initial" ? shown : value]),
  ) as Responsive<"none" | typeof shown>;
}

export type ContainerProps = LayoutProps &
  Readonly<{ size?: "1" | "2" | "3" | "4"; display?: BlockDisplay; align?: "left" | "center" | "right" }>;
export function Container({ size = "4", display, align = "center", ...props }: ContainerProps) {
  const { children, width, minWidth, maxWidth, height, minHeight, maxHeight, ...outer } = props;
  const { element, classes, style } = splitLayout(outer);
  const inner = splitLayout({ width, minWidth, maxWidth, height, minHeight, maxHeight });
  return (
    <div
      {...element}
      style={style}
      data-size={size}
      className={[
        "cairn-Container",
        ...responsiveClasses("display", displayAs(display, "flex")),
        ...responsiveClasses("ai", { left: "start", center: "center", right: "end" }[align]),
        ...classes,
      ].join(" ")}
    >
      <div className={["cairn-ContainerInner", ...inner.classes].join(" ")} style={inner.style}>
        {children}
      </div>
    </div>
  );
}

export type SectionProps = LayoutProps & Readonly<{ size?: "1" | "2" | "3" | "4"; display?: BlockDisplay }>;
export function Section({ size = "3", display, ...props }: SectionProps) {
  const { element, classes, style } = splitLayout(props);
  return (
    <section
      {...element}
      style={style}
      data-size={size}
      className={["cairn-Section", ...responsiveClasses("display", displayAs(display, "block")), ...classes].join(" ")}
    />
  );
}
