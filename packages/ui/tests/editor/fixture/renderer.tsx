import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import { TooltipProvider } from "../../../dist/index.js";
import { DesignSystemPage } from "../../../dist/catalog/index.js";
import { OutlineExtensionFixture } from "./outline-extension-fixture.js";
import { OutlineSuggestionFixture } from "./outline-suggestion-fixture.js";
import { NodeEditorRegionsFixture } from "./node-editor-regions-fixture.js";
import { NodeEditorLifecycleFixture } from "./node-editor-lifecycle-fixture.js";
import { NodeEditorCapabilitiesFixture, NodeEditorMoveSelectionFixture } from "./node-editor-capabilities-fixture.js";
import {
  DelayedRegionFixture,
  NestedRegionFixture,
  ImmediateInsertionFixture,
} from "./node-editor-composition-fixture.js";

const root = document.querySelector("#root");
if (root === null) {
  throw new Error("The editor test root is missing");
}

function TestSurface() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    if (!hash.startsWith("#/design-system")) {
      document.documentElement.dataset.cairnTheme = "forest";
    }
  }, [hash]);
  useEffect(() => {
    const update = () => setHash(window.location.hash);
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  if (hash === "#/outline-suggestion-fixture") {
    return <OutlineSuggestionFixture />;
  }
  if (hash.startsWith("#/node-editor-regions")) {
    return <NodeEditorRegionsFixture empty={hash.endsWith("-empty")} delayed={hash.endsWith("-delayed")} />;
  }
  if (hash.startsWith("#/node-editor-lifecycle")) {
    return <NodeEditorLifecycleFixture empty={hash.endsWith("-empty")} />;
  }
  if (hash === "#/node-editor-capabilities") {
    return <NodeEditorCapabilitiesFixture />;
  }
  if (hash.startsWith("#/node-editor-move-selection")) {
    return <NodeEditorMoveSelectionFixture delayed={hash.endsWith("-delayed")} />;
  }
  if (hash.startsWith("#/node-editor-late-region")) {
    return <DelayedRegionFixture existing={hash.endsWith("-existing")} />;
  }
  if (hash === "#/node-editor-nested-region") {
    return <NestedRegionFixture />;
  }
  if (hash === "#/node-editor-immediate-insertion") {
    return <ImmediateInsertionFixture />;
  }
  if (hash === "#/outline-command-fixture") {
    return <OutlineExtensionFixture commandsEnabled />;
  }
  return hash === "#/outline-extension-fixture" ? <OutlineExtensionFixture /> : <DesignSystemPage />;
}

createRoot(root).render(
  <StrictMode>
    <TooltipProvider>
      <TestSurface />
    </TooltipProvider>
  </StrictMode>,
);
