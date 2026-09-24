import type { ComponentPropsWithoutRef } from "react";

import { cn } from "./cn.js";

export function Link({ className, ...properties }: ComponentPropsWithoutRef<"a">) {
  return (
    <a
      {...properties}
      className={cn(
        "rounded-xs text-primary underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    />
  );
}
