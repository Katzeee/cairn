import { Progress as BaseProgress } from "@base-ui/react/progress";

export function Progress({
  label,
  max = 100,
  value,
}: Readonly<{
  label?: string;
  max?: number;
  value: number;
}>) {
  return (
    <BaseProgress.Root className="flex w-full flex-col gap-1.5" max={max} value={value}>
      {label === undefined ? null : (
        <div className="flex items-baseline justify-between gap-2">
          <BaseProgress.Label className="text-label font-medium">{label}</BaseProgress.Label>
          <BaseProgress.Value className="text-caption text-muted-foreground" />
        </div>
      )}
      <BaseProgress.Track className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <BaseProgress.Indicator className="h-full rounded-full bg-primary transition-[width] duration-(--cairn-duration-standard) ease-(--cairn-ease-standard)" />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
