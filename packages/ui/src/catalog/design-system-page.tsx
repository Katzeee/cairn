import { themeNames, themes, type CairnThemeName } from "@cairn/design-tokens";
import { useEffect, useState } from "react";

import { AppShell, type AppShellSection, type AppShellUtility } from "../components/app-shell.js";
import { CairnTheme } from "../components/cairn-theme.js";
import { ToastProvider } from "../components/toast.js";
import { ComponentPage } from "./docs/component-page.js";
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

const shellSections: readonly AppShellSection[] = [
  { id: "overview", items: [{ id: overviewPage.id, label: overviewPage.title, target: "#/design-system" }] },
  ...catalogSections.map((section) => ({
    id: section.id,
    label: section.title,
    items: section.pages.map((page) => ({
      id: page.id,
      label: page.title,
      target: `#/design-system/${page.path}`,
    })),
  })),
];

export function DesignSystemPage() {
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
  const utilities: readonly AppShellUtility[] = [
    {
      icon: "palette",
      id: "theme",
      label: `Switch to ${themes[nextTheme].label}`,
      onSelect: () => setTheme(nextTheme),
    },
    {
      icon: appearance === "light" ? "moon" : "sun",
      id: "appearance",
      label: appearance === "light" ? "Switch to dark" : "Switch to light",
      onSelect: () => setAppearance(appearance === "light" ? "dark" : "light"),
    },
  ];

  return (
    <CairnTheme appearance={appearance}>
      <ToastProvider>
        <div data-ui="design-system">
          <AppShell activeItemId={page.id} brand="Cairn" sections={shellSections} utilities={utilities}>
            <main className="cairn-CatalogContent">
              <PageContent key={page.id} page={page} theme={theme} />
            </main>
          </AppShell>
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
