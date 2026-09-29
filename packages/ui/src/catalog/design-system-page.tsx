import { themeNames, themes, type CairnThemeName } from "@cairn/design-tokens";
import { useEffect, useState } from "react";

import { AppShell } from "../components/app-shell.js";
import { Button, IconButton } from "../components/button.js";
import { CairnTheme } from "../components/cairn-theme.js";
import { Icon } from "../components/icon.js";
import { ToastProvider } from "../components/toast.js";
import { Tooltip } from "../components/tooltip.js";
import { ComponentPage } from "./docs/component-page.js";
import { ExampleDocument } from "./docs/example-document.js";
import { hostFromQuery, previewRoute, themeFromQuery } from "./docs/preview-protocol.js";
import {
  ColorPage,
  ElevationAndMotionPage,
  SpaceAndShapePage,
  ThemesPage,
  TypographyPage,
} from "./pages/foundations.js";
import { OverviewPage } from "./pages/overview.js";
import { catalogSections, components, findCatalogPage, overviewPage, type CatalogPage, type ComponentId } from "./registry.js";

type Appearance = "light" | "dark";

const route = () => {
  const [path = "", query = ""] = window.location.hash.slice("#/design-system".length).split("?");
  return { path: path.replace(/^\/+|\/+$/g, ""), query: new URLSearchParams(query) };
};

export function DesignSystemPage() {
  const [preview] = useState(() => {
    const { path, query } = route();
    return path.startsWith(previewRoute)
      ? { id: path.slice(previewRoute.length), theme: themeFromQuery(query), host: hostFromQuery(query) }
      : undefined;
  });
  return preview === undefined ? (
    <CatalogShell />
  ) : (
    <ExampleDocument id={preview.id} initialHost={preview.host} initialTheme={preview.theme} />
  );
}

function CatalogShell() {
  const [page, setPage] = useState(() => findCatalogPage(route().path) ?? overviewPage);
  const [appearance, setAppearance] = useState<Appearance>(() => (route().query.get("mode") === "dark" ? "dark" : "light"));
  const [theme, setTheme] = useState<CairnThemeName>(() => {
    const requested = route().query.get("theme");
    return themeNames.find((name) => name === requested) ?? "forest";
  });

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.dataset.cairnTheme;
    root.dataset.cairnTheme = theme;
    return () => {
      if (previous === undefined) delete root.dataset.cairnTheme;
      else root.dataset.cairnTheme = previous;
    };
  }, [theme]);

  useEffect(() => {
    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    let frame: number | undefined;
    const scrollToSection = () => {
      const section = route().query.get("section");
      if (section === null) window.scrollTo({ left: 0, top: 0 });
      else document.getElementById(section)?.scrollIntoView();
    };
    const update = () => {
      setPage(findCatalogPage(route().path) ?? overviewPage);
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scrollToSection);
    };
    scrollToSection();
    window.addEventListener("hashchange", update);
    return () => {
      history.scrollRestoration = previousRestoration;
      if (frame !== undefined) cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", update);
    };
  }, []);

  const nextTheme = themeNames[(themeNames.indexOf(theme) + 1) % themeNames.length]!;
  const appearanceLabel = appearance === "light" ? "Switch to dark" : "Switch to light";

  return (
    <CairnTheme appearance={appearance}>
      <ToastProvider>
        <div data-ui="design-system">
          <AppShell.Root>
            <AppShell.Header>
              <AppShell.SidebarToggle />
              <a className="cairn-CatalogBrand cairn-Focusable" href="#/design-system">
                <span aria-hidden className="cairn-CatalogBrandMark">
                  C
                </span>
                Cairn
              </a>
              <div className="cairn-CatalogHeaderActions">
                <Tooltip content={`Switch to ${themes[nextTheme].label}`}>
                  <Button onClick={() => setTheme(nextTheme)} size="sm" variant="ghost">
                    <Icon name="palette" size="sm" />
                    {themes[theme].label}
                  </Button>
                </Tooltip>
                <Tooltip content={appearanceLabel}>
                  <IconButton
                    aria-label={appearanceLabel}
                    onClick={() => setAppearance(appearance === "light" ? "dark" : "light")}
                    variant="ghost"
                  >
                    <Icon name={appearance === "light" ? "moon" : "sun"} />
                  </IconButton>
                </Tooltip>
              </div>
            </AppShell.Header>
            <AppShell.Sidebar label="Design system">
              <AppShell.NavGroup>
                <AppShell.NavItem active={page.id === overviewPage.id} href="#/design-system">
                  {overviewPage.title}
                </AppShell.NavItem>
              </AppShell.NavGroup>
              {catalogSections.map((section) => (
                <AppShell.NavGroup key={section.id} label={section.title}>
                  {section.pages.map((candidate) => (
                    <AppShell.NavItem active={candidate.id === page.id} href={`#/design-system/${candidate.path}`} key={candidate.id}>
                      {candidate.title}
                    </AppShell.NavItem>
                  ))}
                </AppShell.NavGroup>
              ))}
            </AppShell.Sidebar>
            <AppShell.Main>
              <div className="cairn-CatalogContent">
                <PageContent key={page.id} page={page} theme={theme} />
              </div>
            </AppShell.Main>
          </AppShell.Root>
        </div>
      </ToastProvider>
    </CairnTheme>
  );
}

function PageContent({ page, theme }: Readonly<{ page: CatalogPage; theme: CairnThemeName }>) {
  if (Object.hasOwn(components, page.id)) return <ComponentPage id={page.id as ComponentId} />;
  switch (page.id) {
    case "themes":
      return <ThemesPage />;
    case "color":
      return <ColorPage theme={theme} />;
    case "typography":
      return <TypographyPage theme={theme} />;
    case "space-and-shape":
      return <SpaceAndShapePage theme={theme} />;
    case "elevation-and-motion":
      return <ElevationAndMotionPage theme={theme} />;
    default:
      return <OverviewPage />;
  }
}
