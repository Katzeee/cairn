const lineHeights = { caption: "h-3", body: "h-4", title: "h-5" } as const;
const lineWidths = { full: "w-full", long: "w-4/5", medium: "w-3/5", short: "w-2/5" } as const;
const circleSizes = { sm: "size-6", md: "size-8", lg: "size-10" } as const;

export type SkeletonProps =
  | Readonly<{ shape?: "line"; size?: keyof typeof lineHeights; width?: keyof typeof lineWidths }>
  | Readonly<{ shape: "circle"; size?: keyof typeof circleSizes }>;

export function Skeleton(properties: SkeletonProps) {
  const geometry =
    properties.shape === "circle"
      ? `${circleSizes[properties.size ?? "md"]} rounded-full`
      : `${lineHeights[properties.size ?? "body"]} ${lineWidths[properties.width ?? "full"]} rounded-sm`;
  return <div aria-hidden className={`animate-pulse bg-muted ${geometry}`} />;
}
