import type { ElementProps } from "./element-props.js";

export function Textarea(properties: ElementProps<"textarea">) {
  return (
    <textarea
      {...properties}
      className="w-full rounded-sm border border-input bg-card px-3 py-2 text-body text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
}
