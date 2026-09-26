import { Separator as BaseSeparator } from "@base-ui/react/separator";

export function Separator({ orientation = "horizontal" }: Readonly<{ orientation?: "horizontal" | "vertical" }>) {
  return (
    <BaseSeparator
      className="shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"
      orientation={orientation}
    />
  );
}
