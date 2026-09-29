import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import breakpointWidths from "../../components/breakpoints.json" with { type: "json" };
import { Button } from "../../components/button.js";
import { DropdownMenu } from "../../components/dropdown-menu.js";
import { Icon } from "../../components/icon.js";
import type { ExampleViewport } from "../registry.js";
import { hostChoices, mobileDevices, type DeviceSet } from "./devices.js";
import {
  isPreviewMessage,
  observeTheme,
  previewUrl,
  readTheme,
  type PreviewHost,
  type PreviewMessage,
} from "./preview-protocol.js";

type Range = readonly [min: number, max: number];

const widthRange: Range = [320, 2560];
const heightRange: Range = [240, 1600];
const defaultScreenHeight = 560;
const pendingContentHeight = 160;
const phoneWidth = 375;

const presets = Object.entries(breakpointWidths).map(([name, min]) => ({
  name,
  min,
  width: Math.max(min, phoneWidth),
}));

const clamp = (value: number, [min, max]: Range) =>
  Math.min(max, Math.max(min, Math.round(value)));

export function ViewportPreview({
  id,
  title,
  viewport,
  devices = "any",
}: Readonly<{
  id: string;
  title: string;
  viewport: ExampleViewport;
  devices?: DeviceSet;
}>) {
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [src] = useState(() => previewUrl(id, readTheme()));
  const [available, setAvailable] = useState<number>();
  const [requestedWidth, setRequestedWidth] = useState<number | "fit">("fit");
  const [screenHeight, setScreenHeight] = useState(defaultScreenHeight);
  const [contentHeight, setContentHeight] = useState<number>();
  const [resizing, setResizing] = useState(false);
  const [host, setHost] = useState<PreviewHost>(
    devices === "desktop" ? "macos" : "web",
  );
  const [menu, setMenu] = useState<"host" | "device">();
  const hostRef = useRef(host);
  hostRef.current = host;

  useEffect(() => {
    const element = stage.current;
    if (element === null) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry !== undefined)
        setAvailable(Math.floor(entry.contentRect.width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const target = frame.current;
    if (target === null) return;
    const post = (message: PreviewMessage) =>
      target.contentWindow?.postMessage(message, "*");
    const sendTheme = () =>
      post({ type: "cairn-preview:theme", theme: readTheme() });
    const receive = (event: MessageEvent) => {
      if (
        event.source !== target.contentWindow ||
        !isPreviewMessage(event.data)
      )
        return;
      if (event.data.type === "cairn-preview:ready") {
        sendTheme();
        post({ type: "cairn-preview:host", host: hostRef.current });
      } else if (event.data.type === "cairn-preview:height")
        setContentHeight(event.data.height);
    };
    window.addEventListener("message", receive);
    const stopObservingTheme = observeTheme(sendTheme);
    return () => {
      window.removeEventListener("message", receive);
      stopObservingTheme();
    };
  }, []);

  useEffect(() => {
    frame.current?.contentWindow?.postMessage(
      { type: "cairn-preview:host", host } satisfies PreviewMessage,
      "*",
    );
  }, [host]);

  const width =
    requestedWidth === "fit"
      ? clamp(available ?? widthRange[0], widthRange)
      : requestedWidth;
  const height =
    viewport === "screen"
      ? screenHeight
      : (contentHeight ?? pendingContentHeight);
  const scale = available === undefined ? 1 : Math.min(1, available / width);
  const breakpoint = presets.filter(({ min }) => min <= width).at(-1)?.name;
  // Orientation is read off the viewport, so turning works for a custom size as well as a device.
  const landscape = width > height;
  const device = mobileDevices.find(
    (candidate) =>
      (candidate.width === width && candidate.height === height) ||
      (candidate.height === width && candidate.width === height),
  );
  const resize = (next: Readonly<{ width: number; height: number }>) => {
    setRequestedWidth(clamp(next.width, widthRange));
    setScreenHeight(clamp(next.height, heightRange));
  };
  const showDevice = (id: string) => {
    const chosen = mobileDevices.find((candidate) => candidate.id === id);
    if (chosen === undefined) return;
    resize(landscape ? { width: chosen.height, height: chosen.width } : chosen);
  };
  const turn = (toLandscape: boolean) => {
    if (toLandscape !== landscape) resize({ width: height, height: width });
  };

  return (
    <div
      className="cairn-CatalogViewport"
      data-example={id}
      data-viewport={viewport}
    >
      <div className="cairn-CatalogViewportToolbar">
        <div
          aria-label="Breakpoints"
          className="cairn-CatalogViewportPresets"
          role="group"
        >
          {presets.map((preset) => (
            <button
              aria-pressed={preset.name === breakpoint}
              className="cairn-CatalogViewportPreset cairn-Focusable"
              key={preset.name}
              onClick={() => setRequestedWidth(preset.width)}
              type="button"
            >
              {preset.name}
              <span className="cairn-CatalogViewportPresetWidth">
                {preset.width}
              </span>
            </button>
          ))}
        </div>
        {devices === "mobile" && viewport === "screen" ? (
          <div
            aria-label="Orientation"
            className="cairn-CatalogViewportPresets"
            role="group"
          >
            {(["portrait", "landscape"] as const).map((orientation) => (
              <button
                aria-pressed={landscape === (orientation === "landscape")}
                className="cairn-CatalogViewportPreset cairn-Focusable"
                key={orientation}
                onClick={() => turn(orientation === "landscape")}
                type="button"
              >
                {orientation === "portrait" ? "Portrait" : "Landscape"}
              </button>
            ))}
          </div>
        ) : null}
        {requestedWidth === "fit" ? null : (
          <Button
            onClick={() => setRequestedWidth("fit")}
            size="sm"
            variant="ghost"
          >
            Fit width
          </Button>
        )}
        <div className="cairn-CatalogViewportTrailing">
          <span className="cairn-CatalogViewportSize">
            {width} × {height}
            {viewport === "screen" ? (
              <span className="cairn-CatalogViewportScale">
                {height / width < 0.8 ? "short" : height / width < 1.2 ? "square" : "tall"}
              </span>
            ) : null}
            {scale < 1 ? (
              <span className="cairn-CatalogViewportScale">
                {Math.round(scale * 100)}%
              </span>
            ) : null}
          </span>
          {devices === "desktop" && viewport === "screen" ? (
            <DropdownMenu.Root
              onOpenChange={(open) => setMenu(open ? "host" : undefined)}
              open={menu === "host"}
            >
              <DropdownMenu.Trigger>
                <Button
                  aria-label="Window controls"
                  size="sm"
                  variant="outline"
                >
                  <Icon name="app-window" size="sm" />
                  {hostChoices.find((choice) => choice.host === host)?.name}
                  <Icon name="chevron-down" size="xs" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                <DropdownMenu.Group>
                  <DropdownMenu.Label>Window controls</DropdownMenu.Label>
                  <DropdownMenu.RadioGroup
                    onValueChange={(value) => {
                      setHost(value as PreviewHost);
                      setMenu(undefined);
                    }}
                    value={host}
                  >
                    {hostChoices.map((choice) => (
                      <DropdownMenu.RadioItem
                        key={choice.host}
                        value={choice.host}
                      >
                        {choice.name}
                      </DropdownMenu.RadioItem>
                    ))}
                  </DropdownMenu.RadioGroup>
                </DropdownMenu.Group>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          ) : null}
          {devices === "mobile" && viewport === "screen" ? (
            <DropdownMenu.Root
              onOpenChange={(open) => setMenu(open ? "device" : undefined)}
              open={menu === "device"}
            >
              <DropdownMenu.Trigger>
                <Button aria-label="Device" size="sm" variant="outline">
                  <Icon name="layout-template" size="sm" />
                  {device?.name ?? "Custom size"}
                  <Icon name="chevron-down" size="xs" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                <DropdownMenu.Group>
                  <DropdownMenu.Label>Device</DropdownMenu.Label>
                  <DropdownMenu.RadioGroup
                    onValueChange={(value) => {
                      showDevice(value);
                      setMenu(undefined);
                    }}
                    value={device?.id ?? ""}
                  >
                    {mobileDevices.map((candidate) => (
                      <DropdownMenu.RadioItem
                        key={candidate.id}
                        value={candidate.id}
                      >
                        {candidate.name}
                      </DropdownMenu.RadioItem>
                    ))}
                  </DropdownMenu.RadioGroup>
                </DropdownMenu.Group>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          ) : null}
        </div>
      </div>
      <div
        className="cairn-CatalogViewportStage"
        data-resizing={resizing ? "" : undefined}
        ref={stage}
      >
        <div
          className="cairn-CatalogViewportFrame"
          style={{ width: width * scale, height: height * scale }}
        >
          <div className="cairn-CatalogViewportScreen">
            <iframe
              className="cairn-CatalogViewportDocument"
              ref={frame}
              src={src}
              style={{
                width,
                height,
                transform: scale < 1 ? `scale(${scale})` : undefined,
              }}
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

type Drag = Readonly<{
  pointer: number;
  origin: number;
  value: number;
  scale: number;
}>;

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
  const position = (event: PointerEvent) =>
    axis === "x" ? event.clientX : event.clientY;
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
        drag.current = {
          pointer: event.pointerId,
          origin: position(event),
          value,
          scale,
        };
        onResizingChange(true);
      }}
      onPointerMove={(event) => {
        const current = drag.current;
        if (current?.pointer !== event.pointerId) return;
        onResize(
          clamp(
            current.value +
              (travel * (position(event) - current.origin)) / current.scale,
            range,
          ),
        );
      }}
      onPointerUp={end}
      role="separator"
      tabIndex={0}
    />
  );
}
