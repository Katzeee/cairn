import type { PreviewHost } from "./preview-protocol.js";

// What a screen example offers beside the breakpoints: desktop examples choose the window host,
// mobile examples a device typical of each tier, which then turns between portrait and landscape.
export type DeviceSet = "mobile" | "desktop" | "any";

export const hostChoices: readonly Readonly<{ host: PreviewHost; name: string }>[] = [
  { host: "web", name: "None" },
  { host: "macos", name: "macOS" },
  { host: "windows", name: "Windows" },
];

// Portrait viewports in CSS pixels; landscape swaps them.
export type Device = Readonly<{ id: string; name: string; width: number; height: number }>;

// Foldable sizes divide the panel resolution by the system's display scale (3 on Pura X, 2.625 on
// Galaxy Z Fold); check them against a device before relying on an exact threshold.
export const mobileDevices: readonly Device[] = [
  { id: "iphone-16", name: "iPhone 16", width: 393, height: 852 },
  { id: "pura-x-cover", name: "Huawei Pura X · cover", width: 327, height: 327 },
  { id: "pura-x-inner", name: "Huawei Pura X · unfolded", width: 440, height: 707 },
  { id: "galaxy-z-fold-cover", name: "Galaxy Z Fold · cover", width: 344, height: 882 },
  { id: "galaxy-z-fold-inner", name: "Galaxy Z Fold · unfolded", width: 690, height: 829 },
  { id: "ipad-air-11", name: "iPad Air 11″", width: 820, height: 1180 },
  { id: "ipad-pro-13", name: "iPad Pro 13″", width: 1032, height: 1376 },
];
