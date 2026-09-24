import "@cairn/ui/styles.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastProvider, TooltipProvider } from "@cairn/ui";
import { DesignSystemPage } from "@cairn/ui/catalog";

const root = document.querySelector("#root");
if (root === null) {
  throw new Error("Cairn showcase root is missing");
}

createRoot(root).render(
  <StrictMode>
    <TooltipProvider>
      <ToastProvider>
        <DesignSystemPage />
      </ToastProvider>
    </TooltipProvider>
  </StrictMode>,
);
