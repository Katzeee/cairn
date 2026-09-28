import { createContext, useContext, type ReactNode } from "react";


const OutlineBulletState = createContext({ hasChildren: false, expanded: false });
export const OutlineBulletStateProvider = OutlineBulletState.Provider;

export function OutlineBullet({
  children,
  frame = "none",
  halo,
}: Readonly<{
  children?: ReactNode;
  frame?: "dashed" | "none";
  halo?: "accent" | "muted" | "none";
}>) {
  const state = useContext(OutlineBulletState);
  const resolvedHalo = halo ?? (state.hasChildren && !state.expanded ? "muted" : "none");
  return (
    <span
      className="cairn-OutlineBulletMark"
      data-halo={resolvedHalo}
      data-ui="outline-bullet-mark"
    >
      {frame === "dashed" ? (
        <span
          aria-hidden
          className="cairn-OutlineReferenceRing"
          data-ui="outline-reference-ring"
        />
      ) : null}
      <span className="cairn-OutlineBulletContent">{children ?? <OutlineBulletDot />}</span>
    </span>
  );
}

export function OutlineBulletDot({
  quiet = false,
  color = "gray",
}: Readonly<{ quiet?: boolean; color?: "accent" | "gray" }>) {
  return (
    <span
      className="cairn-OutlineBulletDot"
      data-quiet={quiet ? "true" : undefined}
      data-color={color}
      data-ui={quiet ? "outline-placeholder-bullet" : "outline-node-dot"}
    />
  );
}
