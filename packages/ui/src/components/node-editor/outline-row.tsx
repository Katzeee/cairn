import type { ReactNode } from "react";

import { cn } from "./foundation.js";

export function OutlineRowContent({
  children,
  className,
  details,
  leading,
  prefix,
  suffix,
  trailing,
}: Readonly<{
  children: ReactNode;
  className?: string;
  details?: ReactNode;
  leading?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  trailing?: ReactNode;
}>) {
  return (
    <div className={cn("cairn-OutlineRowContent", className)} data-ui="outline-row-content">
      {leading === undefined ? null : <span className="cairn-OutlineRowLeading">{leading}</span>}
      <div className="cairn-OutlineRowMain">
        <div className="cairn-OutlineRowLine">
          {prefix === undefined ? null : (
            <span className="cairn-OutlineRowPrefix" data-ui="outline-row-prefix">
              {prefix}
            </span>
          )}
          {children}
          {suffix}
          {trailing === undefined ? null : (
            <span className="cairn-OutlineRowTrailing" data-ui="outline-row-trailing">
              {trailing}
            </span>
          )}
        </div>
        {details === undefined ? null : (
          <div className="cairn-OutlineRowDetails" data-ui="outline-row-details">
            {details}
          </div>
        )}
      </div>
    </div>
  );
}

export function OutlineRowProgress({ label, max, value }: Readonly<{ label?: string; max: number; value: number }>) {
  const boundedMax = Math.max(1, max);
  const boundedValue = Math.max(0, Math.min(value, boundedMax));
  const percentage = (boundedValue / boundedMax) * 100;
  return (
    <span
      aria-label={label ?? `${String(boundedValue)} of ${String(boundedMax)}`}
      aria-valuemax={boundedMax}
      aria-valuemin={0}
      aria-valuenow={boundedValue}
      className="cairn-OutlineProgress"
      role="progressbar"
    >
      <span className="cairn-OutlineProgressTrack">
        <span className="cairn-OutlineProgressIndicator" style={{ width: `${String(percentage)}%` }} />
      </span>
      <span>{label ?? `${String(boundedValue)} / ${String(boundedMax)}`}</span>
    </span>
  );
}
