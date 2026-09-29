import { themeNames, themes } from "@cairn/design-tokens";

import { Icon } from "../../components/icon.js";
import { HighlightedCode } from "../docs/highlighted-code.js";
import { catalogSections, componentIds } from "../registry.js";

const setup = `import "@cairn/ui/styles.css";
import "@cairn/ui/themes/forest.css";

import { Button, CairnTheme } from "@cairn/ui";

export function App() {
  return (
    <CairnTheme appearance="inherit">
      <Button>Continue</Button>
    </CairnTheme>
  );
}`;

export function OverviewPage() {
  return (
    <>
      <header className="cairn-CatalogHero">
        <p className="cairn-CatalogEyebrow">Cairn</p>
        <h1 className="cairn-CatalogTitle">Cairn Design System</h1>
        <p className="cairn-CatalogLead">
          One visual and interaction language for every application, carried by themes that give each product its own
          character.
        </p>
        <dl className="cairn-CatalogFacts">
          <div>
            <dt>Themes</dt>
            <dd>{themeNames.map((name) => themes[name].label).join(" · ")}</dd>
          </div>
          <div>
            <dt>Components</dt>
            <dd>{componentIds.length}</dd>
          </div>
          <div>
            <dt>Appearances</dt>
            <dd>Light · Dark</dd>
          </div>
        </dl>
      </header>

      <section className="cairn-CatalogSection">
        <h2 className="cairn-CatalogSectionTitle">Start here</h2>
        <p className="cairn-CatalogSectionDescription">
          Import the shared styles and exactly one theme at the application entry, then compose with components.
        </p>
        <pre className="cairn-CatalogCode cairn-CatalogCodeBlock" tabIndex={0}>
          <HighlightedCode source={setup} />
        </pre>
      </section>

      <section className="cairn-CatalogSection">
        <h2 className="cairn-CatalogSectionTitle">Browse</h2>
        <div className="cairn-CatalogCardGrid">
          {catalogSections.map((section) => (
            <a className="cairn-CatalogNavCard" href={`#/design-system/${section.pages[0]!.path}`} key={section.id}>
              <span className="cairn-CatalogNavCardIcon">
                <Icon glyph={section.pages[0]!.icon} size="sm" />
              </span>
              <span className="cairn-CatalogNavCardTitle">{section.title}</span>
              <span className="cairn-CatalogNavCardMeta">
                {section.pages
                  .slice(0, 4)
                  .map((page) => page.title)
                  .join(", ")}
                {section.pages.length > 4 ? ` and ${section.pages.length - 4} more` : ""}
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
