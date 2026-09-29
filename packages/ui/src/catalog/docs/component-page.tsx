import { catalogSections, componentIds, componentPath, components, type ComponentId } from "../registry.js";
import { ApiReference } from "./api-table.js";
import { Example } from "./example.js";
import { PageHeader } from "./page-header.js";

const href = (id: ComponentId) => `#/design-system/${componentPath(id)}`;

export function ComponentPage({ id }: Readonly<{ id: ComponentId }>) {
  const entry = components[id];
  const index = componentIds.indexOf(id);
  const previous = componentIds[index - 1];
  const next = componentIds[index + 1];
  const section = `${href(id)}?section=`;
  return (
    <>
      <PageHeader
        description={entry.description}
        eyebrow={catalogSections.find((candidate) => candidate.id === entry.group)?.title}
        title={id}
      >
        <nav aria-label="On this page" className="cairn-CatalogPageNav">
          {entry.examples.map(({ id: example }) => (
            <a href={`${section}${example.replace("/", "-")}`} key={example}>
              {example.slice(example.indexOf("/") + 1).replaceAll("-", " ")}
            </a>
          ))}
          <a href={`${section}api-reference`}>API reference</a>
        </nav>
      </PageHeader>
      {entry.examples.map(({ id: example, viewport, devices }) => (
        <Example devices={devices} id={example} key={example} viewport={viewport} />
      ))}
      <section aria-labelledby="api-reference-title" className="cairn-CatalogExample" id="api-reference">
        <h2 className="cairn-CatalogExampleTitle" id="api-reference-title">
          API reference
        </h2>
        <ApiReference exports={entry.exports} />
      </section>
      <nav aria-label="Previous and next component" className="cairn-CatalogPager">
        {previous === undefined ? <span /> : (
          <a data-direction="previous" href={href(previous)}>
            <span>Previous</span>
            <strong>{previous}</strong>
          </a>
        )}
        {next === undefined ? null : (
          <a data-direction="next" href={href(next)}>
            <span>Next</span>
            <strong>{next}</strong>
          </a>
        )}
      </nav>
    </>
  );
}
