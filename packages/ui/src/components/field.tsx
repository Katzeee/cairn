import { Field as BaseField } from "@base-ui/react/field";

import type { ElementProps } from "./element-props.js";

export type FieldProps = ElementProps<"div"> & Readonly<{ disabled?: boolean; invalid?: boolean; name?: string }>;

export function Field(properties: FieldProps) {
  return <BaseField.Root {...properties} className="flex flex-col gap-1.5" />;
}

export function FieldLabel(properties: ElementProps<"label">) {
  return <BaseField.Label {...properties} className="text-label font-medium text-foreground" />;
}

export function FieldDescription(properties: ElementProps<"p">) {
  return <BaseField.Description {...properties} className="text-caption text-muted-foreground" />;
}

export function FieldError(properties: ElementProps<"div"> & Readonly<{ match?: boolean }>) {
  return <BaseField.Error {...properties} className="text-caption font-medium text-destructive" />;
}
