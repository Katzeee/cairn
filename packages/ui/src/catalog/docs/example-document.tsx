import { useEffect, useLayoutEffect, useRef, type MouseEvent } from "react";

import { ToastProvider } from "../../components/toast.js";
import { examples } from "../generated/examples.js";
import { exampleViewport } from "../registry.js";
import { applyTheme, isPreviewMessage, type PreviewMessage, type PreviewTheme } from "./preview-protocol.js";

export function containExampleNavigation(event: MouseEvent<HTMLElement>) {
  if (event.target instanceof Element && event.target.closest("a[href]") !== null) event.preventDefault();
}

const postToHost = (message: PreviewMessage) => window.parent.postMessage(message, "*");

export function ExampleDocument({ id, initialTheme }: Readonly<{ id: string; initialTheme: PreviewTheme }>) {
  const root = useRef<HTMLDivElement>(null);
  const viewport = exampleViewport(id) ?? "content";

  useLayoutEffect(() => applyTheme(initialTheme), [initialTheme]);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.source === window.parent && isPreviewMessage(event.data) && event.data.type === "cairn-preview:theme") {
        applyTheme(event.data.theme);
      }
    };
    window.addEventListener("message", receive);
    const element = root.current;
    const resize = new ResizeObserver(() => {
      if (element !== null) postToHost({ type: "cairn-preview:height", height: Math.ceil(element.getBoundingClientRect().height) });
    });
    if (element !== null && viewport === "content") resize.observe(element);
    postToHost({ type: "cairn-preview:ready" });
    return () => {
      window.removeEventListener("message", receive);
      resize.disconnect();
    };
  }, [viewport]);

  const example = examples[id];
  if (example === undefined) return <p>Unknown example: {id}</p>;
  const { Component } = example;
  return (
    <ToastProvider>
      <div
        className="cairn-CatalogExamplePreview"
        data-example={id}
        data-viewport={viewport}
        onAuxClick={containExampleNavigation}
        onClick={containExampleNavigation}
        ref={root}
      >
        <Component />
      </div>
    </ToastProvider>
  );
}
