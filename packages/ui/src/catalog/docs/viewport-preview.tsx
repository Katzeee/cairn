import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

import breakpointWidths from "../../components/breakpoints.json" with { type: "json" };
import { Button } from "../../components/button.js";
import type { ExampleViewport } from "../registry.js";
import { isPreviewMessage, observeTheme, previewUrl, readTheme, type PreviewMessage } from "./preview-protocol.js";

type Range = readonly [min: number, max: number];

const widthRange: Range = [320, 2560];
const heightRange: Range = [240, 1600];
const defaultScreenHeight = 560;
const pendingContentHeight = 160;
const phoneWidth = 375;

const presets = Object.entries(breakpointWidths).map(([name, min]) => ({ name, min, width: Math.max(min, phoneWidth) }));

const clamp = (value: number, [min, max]: Range) => Math.min(max, Math.max(min, Math.round(value)));

export function ViewportPreview({ id, title, viewport }: Readonly<{ id: string; title: string; viewport: ExampleViewport }>) {
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [src] = useState(() => previewUrl(id, readTheme()));
  const [available, setAvailable] = useState<number>();
  const [requestedWidth, setRequestedWidth] = useState<number | "fit">("fit");
  const [screenHeight, setScreenHeight] = useState(defaultScreenHeight);
  const [contentHeight, setContentHeight] = useState<number>();
  const [resizing, setResizing] = useState(false);

  useEffect(() => {
    const element = stage.current;
    if (element === null) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry !== undefined) setAvailable(Math.floor(entry.contentRect.width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const target = frame.current;
    if (target === null) return;
    const post = (message: PreviewMessage) => target.contentWindow?.postMessage(message, "*");
    const sendTheme = () => post({ type: "cairn-preview:theme", theme: readTheme() });
    const receive = (event: MessageEvent) => {
      if (event.source !== target.contentWindow || !isPreviewMessage(event.data)) return;
      if (event.data.type === "cairn-preview:ready") sendTheme();
      else if (event.data.type === "cairn-preview:height") setContentHeight(event.data.height);
    };
    window.addEventListener("message", receive);
    const stopObservingTheme = observeTheme(sendTheme);
    return () => {
      window.removeEventListener("message", receive);
      stopObservingTheme();
    };
  }, []);

  const width = requestedWidth === "fit" ? clamp(available ?? widthRange[0], widthRange) : requestedWidth;
  const height = viewport === "screen" ? screenHeight : (contentHeight ?? pendingContentHeight);
  const scale = available === undefined ? 1 : Math.min(1, available / width);
  const breakpoint = presets.filter(({ min }) => min <= width).at(-1)?.name;

  return (
    <div className="cairn-CatalogViewport" data-example={id} data-viewport={viewport}>
      <div className="cairn-CatalogViewportToolbar">
        <div aria-label="Breakpoints" className="cairn-CatalogViewportPresets" role="group">
          {presets.map((preset) => (
            <button
              aria-pressed={preset.name === breakpoint}
              className="cairn-CatalogViewportPreset cairn-Focusable"
              key={preset.name}
              onClick={() => setRequestedWidth(preset.width)}
              type="button"
            >
              {preset.name}
              <span className="cairn-CatalogViewportPresetWidth">{preset.width}</span>
            </button>
          ))}
        </div>
        <Button aria-pressed={requestedWidth === "fit"} onClick={() => setRequestedWidth("fit")} size="sm" variant="ghost">
          Fit
        </Button>
        <span className="cairn-CatalogViewportSize">
          {width} × {height}
          {scale < 1 ? <span className="cairn-CatalogViewportScale">{Math.round(scale * 100)}%</span> : null}
        </span>
      </div>
      <div className="cairn-CatalogViewportStage" data-resizing={resizing ? "" : undefined} ref={stage}>
        <div className="cairn-CatalogViewportFrame" style={{ width: width * scale, height: height * scale }}>
          <div className="cairn-CatalogViewportScreen">
            <iframe
              className="cairn-CatalogViewportDocument"
              ref={frame}
              src={src}
              style={{ width, height, transform: scale < 1 ? `scale(${scale})` : undefined }}
              title={`${title} preview`}
            />
          </div>
          <ResizeHandle
            axis="x"
            label="Viewport width"
            onReset={() => setRequestedWidth("fit")}
            onResize={setRequestedWidth}
            onResizingChange={setResizing}
            range={widthRange}
            scale={scale}
            value={width}
          />
          {viewport === "screen" ? (
            <ResizeHandle
              axis="y"
              label="Viewport height"
              onReset={() => setScreenHeight(defaultScreenHeight)}
              onResize={setScreenHeight}
              onResizingChange={setResizing}
              range={heightRange}
              scale={scale}
              value={height}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

type Drag = Readonly<{ pointer: number; origin: number; value: number; scale: number }>;

// The frame is centered, so a width drag grows both edges and each pixel of pointer travel
// counts twice; the scale in effect when the drag began maps screen pixels to viewport pixels.
function ResizeHandle({
  axis,
  label,
  onReset,
  onResize,
  onResizingChange,
  range,
  scale,
  value,
}: Readonly<{
  axis: "x" | "y";
  label: string;
  onReset: () => void;
  onResize: (value: number) => void;
  onResizingChange: (resizing: boolean) => void;
  range: Range;
  scale: number;
  value: number;
}>) {
  const drag = useRef<Drag>(undefined);
  const position = (event: PointerEvent) => (axis === "x" ? event.clientX : event.clientY);
  const travel = axis === "x" ? 2 : 1;

  const end = () => {
    if (drag.current === undefined) return;
    drag.current = undefined;
    onResizingChange(false);
  };

  const step = (event: KeyboardEvent) => {
    const amount = event.shiftKey ? 100 : 10;
    const next = {
      [axis === "x" ? "ArrowLeft" : "ArrowUp"]: value - amount,
      [axis === "x" ? "ArrowRight" : "ArrowDown"]: value + amount,
      Home: range[0],
      End: range[1],
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    onResize(clamp(next, range));
  };

  return (
    <div
      aria-label={label}
      aria-orientation={axis === "x" ? "vertical" : "horizontal"}
      aria-valuemax={range[1]}
      aria-valuemin={range[0]}
      aria-valuenow={value}
      className="cairn-CatalogViewportHandle cairn-Focusable"
      data-axis={axis}
      onDoubleClick={onReset}
      onKeyDown={step}
      onLostPointerCapture={end}
      onPointerCancel={end}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { pointer: event.pointerId, origin: position(event), value, scale };
        onResizingChange(true);
      }}
      onPointerMove={(event) => {
        const current = drag.current;
        if (current?.pointer !== event.pointerId) return;
        onResize(clamp(current.value + (travel * (position(event) - current.origin)) / current.scale, range));
      }}
      onPointerUp={end}
      role="separator"
      tabIndex={0}
    />
  );
}
