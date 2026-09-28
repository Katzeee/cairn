import "@cairn/ui/styles.css";
import "@cairn/ui/catalog.css";
import "@cairn/ui/themes/forest.css";
import "@cairn/ui/themes/slate.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TooltipProvider } from "@cairn/ui";
import { DesignSystemPage } from "@cairn/ui/catalog";

const root = document.querySelector("#root");
if (root === null) {
  throw new Error("Cairn showcase root is missing");
}

createRoot(root).render(
  <StrictMode>
    <TooltipProvider>
      <DesignSystemPage />
    </TooltipProvider>
  </StrictMode>,
);
