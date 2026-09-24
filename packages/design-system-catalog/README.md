# Cairn design-system catalog

This package owns the design-system review vocabulary: sections, stable page paths, descriptions, variants, applicable states, responsive behavior, accessibility guarantees, and token contracts. The React implementations live in `@cairn/ui`; host applications supply their own product screens and platform integration.

The catalog groups its material by use: Foundations, Components, Patterns, Templates and pages, and Review. Layout is a foundation because grids, gutters, content measures, safe areas, and reflow rules constrain every composition. Breakpoints follow available width rather than device labels, so the same rules apply to resized windows and embedded web views.
