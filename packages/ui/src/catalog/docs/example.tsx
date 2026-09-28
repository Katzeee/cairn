import { useState, type MouseEvent } from "react";

import { Button } from "../../components/button.js";
import { Icon } from "../../components/icon.js";
import { examples } from "../generated/examples.js";
import { exampleTitle } from "../registry.js";
import { HighlightedCode } from "./highlighted-code.js";

const collapsedLines = 28;

function containNavigation(event: MouseEvent<HTMLDivElement>) {
  if (event.target instanceof Element && event.target.closest("a[href]") !== null) event.preventDefault();
}

export function Example({ id }: Readonly<{ id: string }>) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const example = examples[id];
  if (example === undefined) throw new Error(`Missing example: ${id}`);
  const { Component, source } = example;
  const lines = source.split("\n").length;
  const collapsible = lines > collapsedLines;
  const title = exampleTitle(id);
  const anchor = id.replace("/", "-");

  const copy = async () => {
    await navigator.clipboard.writeText(source);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section aria-labelledby={`${anchor}-title`} className="cairn-CatalogExample" id={anchor}>
      <h2 className="cairn-CatalogExampleTitle" id={`${anchor}-title`}>
        {title}
      </h2>
      <div className="cairn-CatalogExampleFrame">
        <div className="cairn-CatalogExamplePreview" data-example={id} onClick={containNavigation} onAuxClick={containNavigation}>
          <Component />
        </div>
        <div className="cairn-CatalogExampleSource" data-collapsed={collapsible && !expanded ? "" : undefined}>
          <div className="cairn-CatalogExampleToolbar">
            <span className="cairn-CatalogExampleFile">{id.slice(id.indexOf("/") + 1)}.tsx</span>
            <Button onClick={() => void copy()} size="sm" variant="ghost">
              <Icon name={copied ? "check" : "copy"} size="sm" />
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <pre className="cairn-CatalogCode" tabIndex={0}>
            <HighlightedCode source={source} />
          </pre>
          {collapsible ? (
            <div className="cairn-CatalogExampleExpand">
              <Button onClick={() => setExpanded(!expanded)} size="sm" variant="outline">
                {expanded ? "Collapse code" : `Show all ${lines} lines`}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
