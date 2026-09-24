import { tokens } from "@cairn/design-tokens";
import { createContext, useContext } from "react";

export type CatalogMode = "light" | "dark";
export type ThemeName = keyof typeof tokens.theme;
export const themeNames = Object.keys(tokens.theme) as readonly ThemeName[];

export const CatalogModeContext = createContext<CatalogMode>("light");

export function useCatalogMode(): CatalogMode {
  return useContext(CatalogModeContext);
}
