import {
  componentDocs,
  componentPath,
  type CatalogComponentId,
  type ComponentDocumentation,
} from "@cairn/design-system-catalog";
import type { ReactNode } from "react";

import { CairnPreviewTheme } from "../cairn-theme.js";
import { AppShell } from "../components/app-shell.js";
import { Button } from "../components/button.js";
import { PageScaffold } from "../components/page-scaffold.js";
import { LegalPage } from "../legal-page.js";
import type { ApiProperty } from "./api-reference-types.js";
import { ButtonsPage, FormsPage, StatusPage, SurfacesPage } from "./component-pages.js";
import { EditorParts } from "./editor-parts.js";
import { apiReference } from "./generated-api.js";
import { LayoutPage } from "./layout-page.js";
import { NavigationPage } from "./navigation-page.js";
import { OutlinePage } from "./outline-page.js";
import { OverlaysPage } from "./overlays-page.js";
import { PageIntro, Specimen, SpecimenSelection } from "./specimen.js";

const linkClass =
  "inline-flex min-h-(--cairn-control-hit-target) items-center rounded-xs text-label text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring";
const ids = Object.keys(componentDocs) as CatalogComponentId[];

export function ComponentReferencePage({ id }: Readonly<{ id: CatalogComponentId }>) {
  const doc = componentDocs[id];
  const currentIndex = ids.indexOf(id);
  const siblings = [ids[currentIndex - 1], ids[currentIndex + 1]].filter(
    (candidate): candidate is CatalogComponentId => candidate !== undefined,
  );
  return (
    <>
      <PageIntro title={id} description={doc.description} />
      <nav aria-label="On this page" className="mb-8 flex flex-wrap gap-x-5 gap-y-2">
        {["examples", "usage", "api-reference"].map((section) => (
          <a className={linkClass} href={`#/design-system/${componentPath(id)}?section=${section}`} key={section}>
            {section === "api-reference" ? "API Reference" : section === "examples" ? "Examples" : "Usage"}
          </a>
        ))}
      </nav>
      <div id="examples" className="scroll-mt-6">
        <SpecimenSelection.Provider value={doc.samples}>
          <ComponentExamples doc={doc} />
        </SpecimenSelection.Provider>
      </div>
      <section id="usage" className="mb-10 scroll-mt-6">
        <h2 className="mb-4 text-title-small font-semibold">Usage</h2>
        <CodeBlock>{usageSource(doc)}</CodeBlock>
        <p className="mt-3 text-caption text-muted-foreground">
          Controlled state, callbacks, refs, and document data in the example are supplied by the application.
        </p>
      </section>
      <section id="api-reference" className="scroll-mt-6">
        <h2 className="mb-2 text-title-small font-semibold">API Reference</h2>
        <p className="mb-6 text-body text-muted-foreground">
          The tables follow the public TypeScript API. Required properties must be supplied. An em dash means Cairn
          declares no explicit default for that property.
        </p>
        {doc.exports.map((name) => {
          const entry = apiReference[name];
          if (!entry) return null;
          return (
            <section className="mb-10" key={name} data-api-component={name}>
              <h3 className="mb-2 text-body-large font-semibold">{name}</h3>
              <a
                className={linkClass}
                href={`https://github.com/Katzeee/cairn/blob/main/packages/ui/${entry.source}`}
                target="_blank"
                rel="noreferrer"
              >
                View source
              </a>
              <PropsTable rows={entry.props} name={name} />
              {entry.inherited.length === 0 ? null : (
                <details className="mt-4 rounded-md border border-border p-4">
                  <summary className="min-h-(--cairn-control-hit-target) cursor-pointer text-label font-medium">
                    Inherited React attributes ({entry.inherited.length})
                  </summary>
                  <PropsTable rows={entry.inherited} name={`${name} inherited attributes`} />
                </details>
              )}
              <details className="mt-4 rounded-md border border-border p-4">
                <summary className="min-h-(--cairn-control-hit-target) cursor-pointer text-label font-medium">
                  Full TypeScript reference
                </summary>
                <div className="mt-4">
                  <CodeBlock>{`${entry.signature}\n\n${entry.definitions.map((definition) => definition.source).join("\n\n")}`}</CodeBlock>
                </div>
              </details>
            </section>
          );
        })}
      </section>
      <nav
        aria-label="Previous and next component"
        className="mt-10 flex flex-wrap justify-between gap-4 border-t border-border pt-6"
      >
        {siblings.map((other) => (
          <a className={linkClass} href={`#/design-system/${componentPath(other)}`} key={other}>
            {ids.indexOf(other) < currentIndex ? "← " : ""}
            {other}
            {ids.indexOf(other) > currentIndex ? " →" : ""}
          </a>
        ))}
      </nav>
    </>
  );
}

function usageSource(doc: ComponentDocumentation): string {
  const names = new Set([...doc.exports, ...[...doc.usage.matchAll(/<([A-Z]\w*)/g)].map((match) => match[1]!)]);
  const imports = new Map<string, string[]>();
  for (const name of names) {
    const entry = apiReference[name]?.entry;
    if (entry) imports.set(entry, [...(imports.get(entry) ?? []), name]);
  }
  return `import "@cairn/ui/styles.css";\n${[...imports].map(([entry, exports]) => `import { ${exports.join(", ")} } from "${entry}";`).join("\n")}\n\n${doc.usage}`;
}

function CodeBlock({ children }: Readonly<{ children: string }>) {
  return (
    <pre
      className="max-w-full overflow-x-auto rounded-md border border-border bg-muted p-4 font-mono text-caption whitespace-pre-wrap break-words"
      tabIndex={0}
    >
      <code>{children}</code>
    </pre>
  );
}

function PropsTable({ rows, name }: Readonly<{ rows: readonly ApiProperty[]; name: string }>) {
  if (rows.length === 0)
    return (
      <p className="mt-4 text-body text-muted-foreground">
        No component-specific properties. See the full reference and inherited attributes below.
      </p>
    );
  return (
    <div className="mt-4 max-w-full overflow-x-auto rounded-md border border-border" tabIndex={0}>
      <table className="w-full text-left text-caption">
        <caption className="sr-only">{name} properties</caption>
        <thead className="bg-muted">
          <tr>
            <th scope="col" className="p-3">
              Prop
            </th>
            <th scope="col" className="p-3">
              Type
            </th>
            <th scope="col" className="p-3">
              Required
            </th>
            <th scope="col" className="p-3">
              Default
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className="border-t border-border align-top" key={row.name}>
              <th scope="row" className="p-3 font-mono font-medium">
                {row.name}
                {row.description ? (
                  <p className="mt-1 font-sans font-normal text-muted-foreground">{row.description}</p>
                ) : null}
              </th>
              <td className="min-w-40 p-3">
                <code className="break-words whitespace-pre-wrap">{row.type}</code>
              </td>
              <td className="p-3">{row.required ? "Yes" : "No"}</td>
              <td className="p-3">
                <code>{row.default ?? "—"}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComponentExamples({ doc }: Readonly<{ doc: ComponentDocumentation }>): ReactNode {
  switch (doc.demo) {
    case "buttons":
      return <ButtonsPage />;
    case "forms":
      return <FormsPage />;
    case "navigation":
      return <NavigationPage />;
    case "overlays":
      return <OverlaysPage />;
    case "status":
      return <StatusPage />;
    case "surfaces":
      return <SurfacesPage />;
    case "layouts":
      return <LayoutPage />;
    case "editor":
      return <EditorParts />;
    case "outline":
      return <OutlinePage />;
    case "shell":
      return (
        <Specimen title="Responsive shell" className="block overflow-hidden p-0">
          <div className="max-h-100 overflow-auto">
            <AppShell
              activeItemId="home"
              sections={[
                {
                  id: "main",
                  items: [{ id: "home", label: "Home", target: "#/design-system/layout/app-shell", icon: "house" }],
                },
              ]}
            >
              <p className="p-6 text-body">The shell responds to its container width.</p>
            </AppShell>
          </div>
        </Specimen>
      );
    case "scaffold":
      return (
        <Specimen title="Page structure" className="block p-0">
          <PageScaffold
            title="Projects"
            description="A shared page structure."
            actions={<Button size="sm">Create project</Button>}
          >
            <p className="text-body">Application content belongs here.</p>
          </PageScaffold>
        </Specimen>
      );
    case "theme":
      return (
        <Specimen title="Theme preview" className="block">
          <CairnPreviewTheme appearance="dark" theme="slate">
            <div className="rounded-md p-6">
              <p className="mb-4 text-body">A preview of the root theme configuration.</p>
              <Button>Scoped action</Button>
            </div>
          </CairnPreviewTheme>
        </Specimen>
      );
    case "legal":
      return (
        <Specimen title="Bundled font licenses" className="block p-0">
          <LegalPage embedded backHref="#/design-system/utilities/legal-page" backLabel="LegalPage reference" />
        </Specimen>
      );
  }
}
