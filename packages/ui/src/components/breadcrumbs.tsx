import { Fragment } from "react";

import { Icon } from "./icon.js";

export type BreadcrumbItem = Readonly<{
  label: string;
  href?: string;
  onSelect?: () => void;
  current?: boolean;
}>;

export function Breadcrumbs({ items }: Readonly<{ items: readonly BreadcrumbItem[] }>) {
  return (
    <nav aria-label="Breadcrumb" className="cairn-Breadcrumbs">
      <ol>
        {items.map((item, index) => (
          <Fragment key={`${item.label}-${String(index)}`}>
            {index === 0 ? null : (
              <li aria-hidden className="cairn-BreadcrumbsSeparator">
                <Icon name="chevron-right" size="xs" />
              </li>
            )}
            <li className="cairn-BreadcrumbsItem">
              <Crumb current={item.current ?? index === items.length - 1} item={item} />
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}

function Crumb({ current, item }: Readonly<{ current: boolean; item: BreadcrumbItem }>) {
  if (!current && item.href !== undefined) {
    return (
      <a className="cairn-BreadcrumbsLink cairn-Focusable" href={item.href}>
        {item.label}
      </a>
    );
  }
  if (!current && item.onSelect !== undefined) {
    return (
      <button className="cairn-BreadcrumbsLink cairn-Focusable" onClick={item.onSelect} type="button">
        {item.label}
      </button>
    );
  }
  return (
    <span aria-current={current ? "page" : undefined} className="cairn-BreadcrumbsCurrent">
      {item.label}
    </span>
  );
}
