import type { IconName } from "@cairn/design-system-catalog";
import type { ReactNode } from "react";

import { Icon } from "./icon.js";

export function EmptyState({
  action,
  description,
  icon,
  title,
}: Readonly<{
  action?: ReactNode;
  description?: string;
  icon?: IconName;
  title: string;
}>) {
  return (
    <div
      className="flex w-full flex-col items-center gap-1 rounded-lg border border-dashed border-input px-6 py-10 text-center"
    >
      {icon === undefined ? null : (
        <span className="mb-2 grid size-10 place-items-center rounded-full bg-secondary text-muted-foreground">
          <Icon name={icon} />
        </span>
      )}
      <h3 className="text-body font-semibold">{title}</h3>
      {description === undefined ? null : <p className="max-w-96 text-caption text-muted-foreground">{description}</p>}
      {action === undefined ? null : <div className="mt-4">{action}</div>}
    </div>
  );
}
