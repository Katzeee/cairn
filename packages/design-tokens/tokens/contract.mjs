// The semantic contract between themes and components. Components read only the
// tokens declared here; every theme must assign every theme token.

export const tones = ["accent", "neutral", "info", "success", "warning", "danger"];
export const statusTones = ["info", "success", "warning", "danger"];
export const toneScales = { accent: "accent", neutral: "gray", info: "info", success: "success", warning: "warning", danger: "danger" };

// Each tone exposes the same roles, each bound to one step of its Radix scale.
export const toneRoles = {
  solid: { step: "9", use: "Filled backgrounds of primary actions and indicators." },
  "solid-hover": { step: "10", use: "Hovered filled backgrounds." },
  "on-solid": { step: "contrast", use: "Text and icons on a filled background." },
  subtle: { step: "a3", use: "Tinted backgrounds of soft badges, callouts, and hover states." },
  "subtle-hover": { step: "a4", use: "Hovered tinted backgrounds." },
  "subtle-active": { step: "a5", use: "Pressed or selected tinted backgrounds." },
  border: { step: "a6", use: "Borders of tinted surfaces." },
  "border-strong": { step: "a8", use: "Borders that must stand out from tinted surfaces." },
  text: { step: "a11", use: "Tinted text with accessible contrast on the page." },
  "text-strong": { step: "12", use: "High-contrast tinted text." },
};

// Neutral roles map to palette primitives; a pair is [light, dark].
export const colorRoles = {
  canvas: { value: "var(--color-background)", use: "The page behind every surface." },
  surface: { value: ["white", "var(--gray-2)"], use: "Cards, inputs, and stationary panels." },
  "surface-muted": { value: "var(--gray-a3)", use: "Recessed or secondary surfaces." },
  overlay: { value: ["white", "var(--gray-3)"], use: "Menus, popovers, dialogs, and toasts." },
  text: { value: "var(--gray-12)", use: "Primary text." },
  "text-muted": { value: "var(--gray-11)", use: "Supporting text, placeholders, and idle icons." },
  "text-disabled": { value: "var(--gray-a8)", use: "Text of unavailable content." },
  border: { value: "var(--gray-a5)", use: "Quiet boundaries between surfaces." },
  "border-strong": { value: "var(--gray-a7)", use: "Boundaries of editable controls." },
  inverse: { value: "var(--gray-12)", use: "Inverted surfaces such as tooltips." },
  "on-inverse": { value: "var(--gray-1)", use: "Text on inverted surfaces." },
  backdrop: { value: ["var(--black-a6)", "var(--black-a9)"], use: "The scrim behind modal layers." },
  selection: { value: "var(--accent-a5)", use: "Selected text and selected editor content." },
  "focus-ring": { value: "var(--accent-a8)", use: "Keyboard focus outlines." },
  "focus-halo": { value: "var(--accent-a4)", use: "The soft ring around a focused text control." },
};

export const textRoles = ["caption", "label", "body", "body-large", "document", "title-small", "title", "page-title", "display"];

const group = (title, description, tokens) => ({ title, description, tokens });

export const themeTokenGroups = {
  typography: group("Typography", "Font families, weights, and the size and line height of each text role.", {
    "font-interface": "Interface text.",
    "font-document": "Long-form document text.",
    "font-code": "Code and keyboard input.",
    "weight-regular": "Body text.",
    "weight-medium": "Labels and controls.",
    "weight-semibold": "Headings and emphasis.",
    "weight-bold": "Strong emphasis.",
    "heading-letter-spacing": "Tracking applied to headings.",
    ...Object.fromEntries(
      textRoles.flatMap((role) => [
        [`text-${role}-size`, `Font size of the ${role} role.`],
        [`text-${role}-line-height`, `Line height of the ${role} role.`],
      ]),
    ),
  }),
  space: group(
    "Space",
    "The nine-step spacing scale used by layout gaps and padding.",
    Object.fromEntries(Array.from({ length: 9 }, (_, index) => [`space-${index + 1}`, `Space step ${index + 1}.`])),
  ),
  shape: group("Shape", "Corner radii by role and the hairline border width.", {
    "radius-selection": "Editor selection frames.",
    "radius-indicator": "Checkboxes, keyboard keys, and inline code.",
    "radius-control": "Buttons, inputs, and tooltips.",
    "radius-item": "Menu, navigation, and list items.",
    "radius-panel": "Menus, popovers, select lists, and callouts.",
    "radius-card": "Cards and empty states.",
    "radius-dialog": "Dialogs and toasts.",
    "radius-pill": "Badges, switches, and progress tracks.",
    "border-width": "Hairline borders.",
  }),
  control: group("Controls", "Heights and horizontal padding of the three control sizes.", {
    "control-height-sm": "Compact controls.",
    "control-height-md": "Default controls.",
    "control-height-lg": "Prominent controls.",
    "control-padding-sm": "Inline padding of compact controls.",
    "control-padding-md": "Inline padding of default controls.",
    "control-padding-lg": "Inline padding of prominent controls.",
    "focus-ring-width": "Width of the keyboard focus outline.",
    "focus-ring-offset": "Gap between a control and its focus outline.",
    "disabled-opacity": "Opacity of unavailable controls.",
  }),
  elevation: group("Elevation", "Shadows by layer. A theme may keep stationary layers flat.", {
    "elevation-control": "Buttons and editable controls.",
    "elevation-card": "Cards and stationary panels.",
    "elevation-popover": "Menus, popovers, and select lists.",
    "elevation-dialog": "Modal dialogs and drawers.",
    "elevation-toast": "Toast notifications.",
    "elevation-tooltip": "Tooltips.",
    "overlay-backdrop-filter": "Filter applied behind floating panels.",
  }),
  motion: group("Motion", "Durations and easing of state changes and panels.", {
    "duration-fast": "Hover, focus, and color changes.",
    "duration-standard": "Indicators and small movements.",
    "duration-panel": "Overlays entering and leaving.",
    "ease-standard": "Easing of every transition.",
  }),
};

export const themeTokens = Object.values(themeTokenGroups).flatMap((entry) => Object.keys(entry.tokens));

// Optional per-component hooks. Component CSS reads each hook with its semantic default,
// so a theme can go more specific without components changing.
export const componentTokens = {
  "button-primary-background": "Primary button fill; may be a gradient.",
  "button-primary-hover-background": "Hovered primary button fill.",
  "button-shadow": "Shadow of every button; defaults to control elevation.",
  "card-background": "Card fill.",
  "card-shadow": "Card shadow; defaults to card elevation.",
  "card-border-color": "Card border color.",
  "input-background": "Fill of text fields, text areas, selects, and comboboxes.",
  "input-shadow": "Shadow of editable controls; defaults to control elevation.",
  "overlay-background": "Fill of menus, popovers, dialogs, and toasts.",
};

// Pairs that must stay legible in every theme and appearance, checked on solid scale steps.
export const contrastRequirements = [
  { foreground: "gray-12", background: "background", minimum: 7 },
  { foreground: "gray-11", background: "background", minimum: 4.5 },
  { foreground: "gray-11", background: "gray-2", minimum: 4.5 },
];
// Tone role pairs checked with the steps each theme binds. Neutral solid is a mid-gray
// indicator color; no component places text on it.
export const toneContrastRequirements = [
  { foreground: "on-solid", background: "solid", minimum: 4.5, except: ["neutral"] },
  { foreground: "text", background: "subtle", minimum: 4.5, except: [] },
];
