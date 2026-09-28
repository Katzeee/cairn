import { useEffect, type ReactNode } from "react";

export type CairnAppearance = "inherit" | "light" | "dark";

export type CairnThemeProps = Readonly<{
  appearance?: CairnAppearance;
  children?: ReactNode;
}>;

// Appearance lives on the document root so portaled layers resolve the same light-dark() values.
export function CairnTheme({ appearance = "inherit", children }: CairnThemeProps) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.dataset.cairnAppearance;
    if (appearance === "inherit") delete root.dataset.cairnAppearance;
    else root.dataset.cairnAppearance = appearance;
    return () => {
      if (previous === undefined) delete root.dataset.cairnAppearance;
      else root.dataset.cairnAppearance = previous;
    };
  }, [appearance]);
  return <>{children}</>;
}
