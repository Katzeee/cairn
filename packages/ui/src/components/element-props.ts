import type { ComponentPropsWithRef, ElementType } from "react";

// Applications choose among designed variants; className and style stay inside Cairn.
export type ElementProps<T extends ElementType, Excluded extends PropertyKey = never> = Omit<
  ComponentPropsWithRef<T>,
  "className" | "style" | Excluded
>;
