// The semantic contract between themes and components. Components read only the
// tokens declared here; every theme assigns every color, tone, and theme token.

const group = (title, description, tokens) => ({ title, description, tokens });

// Read as --cairn-color-<token>. A theme assigns each one a CSS color or a [light, dark] pair.
export const colorTokenGroups = {
  layers: group("Layers", "Backgrounds from the page up to modal layers.", {
    canvas: "The page behind every surface.",
    surface: "Cards, inputs, and stationary panels.",
    "surface-muted": "Recessed areas and secondary buttons inside a surface.",
    navigation: "The app shell's navigation region.",
    overlay: "Menus, popovers, dialogs, and toasts.",
    inverse: "Inverted surfaces such as tooltips.",
    backdrop: "The scrim behind modal layers.",
  }),
  content: group("Text and borders", "Text levels, links, and boundaries.", {
    text: "Primary text.",
    "text-muted": "Supporting text, placeholders, and idle icons.",
    "text-disabled": "Text of unavailable content.",
    "on-inverse": "Text on inverted surfaces.",
    link: "Inline links and their underline.",
    border: "Quiet boundaries between surfaces.",
    "border-strong": "Boundaries of editable controls.",
  }),
  interaction: group(
    "Interaction",
    "Feedback on items without a fill of their own: ghost buttons, navigation, list rows, menu items, and editor rows.",
    {
      hover: "Background of a hovered or highlighted item.",
      pressed: "Background of a pressed item.",
      selected: "Background of the current or selected item.",
      "selected-text": "Text and icons of the current or selected item.",
    },
  ),
  focus: group("Focus and selection", "Keyboard focus, selection frames, and selected text.", {
    "focus-ring": "Keyboard focus outlines and frames around selected editor content.",
    "focus-halo": "The soft ring around a focused text control.",
    "focus-border": "Border of a focused text control.",
    selection: "Selected text.",
  }),
  primary: group("Primary action", "The one most important action in a view.", {
    primary: "Fill of primary buttons.",
    "primary-hover": "Hovered fill of primary buttons.",
    "on-primary": "Text and icons on primary buttons.",
  }),
  brand: group("Brand", "The product's own color, kept apart from state.", {
    brand: "Brand text such as eyebrows, legible on the page and surfaces.",
    "brand-solid": "Filled brand marks.",
    "on-brand": "Text and icons on filled brand marks.",
  }),
};

export const colorTokens = Object.values(colorTokenGroups).flatMap((entry) => Object.keys(entry.tokens));

// Read as --cairn-<tone>-<role>. The accent tone marks state: checked controls, the active tab,
// progress, and counts. Hover, selection, links, primary buttons, and brand have their own color tokens.
export const tones = ["accent", "neutral", "info", "success", "warning", "danger"];
export const toneRoles = {
  solid: "Filled indicators and destructive buttons.",
  "solid-hover": "Hovered filled backgrounds.",
  "on-solid": "Text and icons on a filled background.",
  subtle: "Tinted backgrounds of badges and callouts.",
  "subtle-hover": "Hovered tinted backgrounds.",
  "subtle-active": "Pressed tinted backgrounds.",
  border: "Borders of tinted surfaces.",
  "border-strong": "Borders that must stand out from tinted surfaces.",
  text: "Tinted text with accessible contrast on the page.",
};

export const textRoles = ["caption", "label", "body", "body-large", "document", "title-small", "title", "page-title", "display"];

export const themeTokenGroups = {
  typography: group("Typography", "Font families, weights, and the size and line height of each text role.", {
    "font-interface": "Interface text.",
    "font-document": "Long-form document text.",
    "font-code": "Code and keyboard input.",
    "weight-regular": "Body text.",
    "weight-medium": "Labels, primary actions, and emphasis.",
    "weight-control": "Text of controls and selectable rows: buttons, segments, tabs, navigation items, choices, and list rows.",
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
  control: group("Controls", "Heights and horizontal padding of the three control sizes and of rows in menus and lists.", {
    "control-height-sm": "Compact controls.",
    "control-height-md": "Default controls.",
    "control-height-lg": "Prominent controls.",
    "control-padding-sm": "Inline padding of compact controls.",
    "control-padding-md": "Inline padding of default controls.",
    "control-padding-lg": "Inline padding of prominent controls.",
    "item-height": "Single-line rows in menus, select lists, suggestion lists, and lists.",
    "item-padding-inline": "Inline padding of those rows, their group labels, and empty messages.",
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

// Component tokens for decisions that differ between themes in one component. Every theme assigns
// every one, often by naming the semantic token it shares.
export const componentTokens = {
  "button-primary-background": "Primary button fill; may be a gradient.",
  "button-primary-hover-background": "Hovered primary button fill.",
  "button-shadow": "Shadow of every button.",
  "button-secondary-background": "Secondary button fill.",
  "button-secondary-hover-background": "Hovered secondary button fill.",
  "card-background": "Card fill.",
  "card-shadow": "Card shadow.",
  "card-border-color": "Card border color.",
  "empty-state-icon-background": "Fill behind an empty state's icon.",
  "empty-state-icon-color": "Color of an empty state's icon.",
  "input-background": "Fill of text fields, text areas, selects, and comboboxes.",
  "input-border-color": "Border of those editable controls at rest.",
  "input-shadow": "Shadow of editable controls.",
  "overlay-background": "Fill of menus, popovers, dialogs, and toasts.",
  "popup-destructive-highlight-background": "Fill of a highlighted destructive menu item.",
  "popup-destructive-highlight-text": "Text of a highlighted destructive menu item.",
  "popup-separator-inset": "Inline inset of menu separators from the panel edge.",
  "segmented-control-inset": "Gap between a segmented control's track and its segments, and between segments.",
  "segmented-control-thumb-background": "Fill of the selected segment.",
  "segmented-control-thumb-shadow": "Shadow or ring of the selected segment.",
  "switch-width": "Width of a switch track.",
  "switch-height": "Height of a switch track.",
  "switch-thumb-background": "Fill of the switch thumb.",
  "switch-thumb-shadow": "Shadow of the switch thumb.",
  "title-bar-title-color": "Color of the window title.",
  "title-bar-title-weight": "Font weight of the window title.",
  "tooltip-text-size": "Tooltip font size.",
  "tooltip-text-line-height": "Tooltip line height.",
};

// Layout constants with the same value in every theme.
export const sharedTokens = {
  "control-hit-target": "48px",
  "sidebar-width": "252px",
  "content-width-reading": "720px",
  "content-width-document": "800px",
  "content-width-standard": "1120px",
  "content-width-wide": "1440px",
  "container-1": "448px",
  "container-2": "688px",
  "container-3": "880px",
  "container-4": "1136px",
  "content-inset": "16px",
  // Stacking order across regions, lowest first. Host window controls stay above everything the
  // page draws, as native controls do.
  "layer-sticky": "20",
  "layer-shell": "30",
  "layer-popup": "50",
  "layer-toast": "60",
  "layer-window-controls": "70",
  ...Object.fromEntries(["top", "right", "bottom", "left"].map((edge) => [`safe-area-${edge}`, `env(safe-area-inset-${edge}, 0px)`])),
  // Window Controls Overlay describes the title bar area left to the page; host adapters without it
  // assign these three tokens from their own window chrome.
  "titlebar-height": "env(titlebar-area-height, 48px)",
  "titlebar-inset-left": "env(titlebar-area-x, 0px)",
  "titlebar-inset-right": "calc(100vw - env(titlebar-area-x, 0px) - env(titlebar-area-width, 100vw))",
};
