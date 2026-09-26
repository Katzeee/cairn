import { cn } from "./cn.js";
import type { ElementProps } from "./element-props.js";

export type CardVariant = "surface" | "muted";

const variants: Readonly<Record<CardVariant, string>> = {
  surface: "border-border bg-card text-card-foreground",
  muted: "border-transparent bg-muted text-foreground",
};

export function Card({ variant = "surface", ...properties }: ElementProps<"article"> & Readonly<{ variant?: CardVariant }>) {
  return <article {...properties} className={cn("rounded-lg border", variants[variant])} />;
}

export function CardHeader(properties: ElementProps<"header">) {
  return <header {...properties} className="flex flex-col gap-1.5 p-6 pb-0" />;
}

export type CardTitleProps = ElementProps<"h2"> &
  Readonly<{ as?: "h2" | "h3" | "h4"; size?: "default" | "compact" }>;

export function CardTitle({ as: Element = "h2", size = "default", ...properties }: CardTitleProps) {
  return (
    <Element
      {...properties}
      className={size === "compact" ? "text-body font-semibold" : "text-title-small font-semibold tracking-tight"}
    />
  );
}

export function CardDescription(properties: ElementProps<"p">) {
  return <p {...properties} className="text-body text-muted-foreground" />;
}

export function CardContent(properties: ElementProps<"div">) {
  return <div {...properties} className="p-6" />;
}

export function CardFooter(properties: ElementProps<"footer">) {
  return <footer {...properties} className="flex items-center gap-3 p-6 pt-0" />;
}
