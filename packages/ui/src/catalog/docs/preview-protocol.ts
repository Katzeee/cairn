// A viewport preview is the catalog loaded again in an iframe at `#/design-system/preview/<example>`.
// The host and the preview talk only through messages, so neither reaches into the other's document.

export const previewRoute = "preview/";

export type PreviewTheme = Readonly<{ theme: string | null; appearance: string | null }>;

// A simulated window host: the insets its system controls take and a drawing of them. The catalog
// draws the controls; Cairn only keeps content clear of them.
export const previewHosts = ["web", "macos", "windows"] as const;
export type PreviewHost = (typeof previewHosts)[number];

export function applyHost(host: PreviewHost) {
  if (host === "web") delete document.documentElement.dataset.catalogHost;
  else document.documentElement.dataset.catalogHost = host;
}

export function hostFromQuery(query: URLSearchParams): PreviewHost {
  return previewHosts.find((host) => host === query.get("host")) ?? "web";
}

export type PreviewMessage =
  | Readonly<{ type: "cairn-preview:ready" }>
  | Readonly<{ type: "cairn-preview:height"; height: number }>
  | Readonly<{ type: "cairn-preview:theme"; theme: PreviewTheme }>
  | Readonly<{ type: "cairn-preview:host"; host: PreviewHost }>;

const themeAttributes = { theme: "data-cairn-theme", appearance: "data-cairn-appearance" } as const;

export function isPreviewMessage(data: unknown): data is PreviewMessage {
  return typeof data === "object" && data !== null && String((data as { type?: unknown }).type).startsWith("cairn-preview:");
}

export function readTheme(): PreviewTheme {
  const root = document.documentElement;
  return { theme: root.getAttribute(themeAttributes.theme), appearance: root.getAttribute(themeAttributes.appearance) };
}

export function applyTheme(theme: PreviewTheme) {
  const root = document.documentElement;
  for (const key of ["theme", "appearance"] as const) {
    const value = theme[key];
    if (value === null) root.removeAttribute(themeAttributes[key]);
    else root.setAttribute(themeAttributes[key], value);
  }
}

export function observeTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: Object.values(themeAttributes) });
  return () => observer.disconnect();
}

export function previewUrl(example: string, theme: PreviewTheme): string {
  const url = new URL(window.location.href);
  const query = new URLSearchParams();
  if (theme.theme !== null) query.set("theme", theme.theme);
  if (theme.appearance !== null) query.set("appearance", theme.appearance);
  url.hash = `/design-system/${previewRoute}${example}?${query}`;
  return url.href;
}

export function themeFromQuery(query: URLSearchParams): PreviewTheme {
  return { theme: query.get("theme"), appearance: query.get("appearance") };
}
