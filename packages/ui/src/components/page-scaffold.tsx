import type { ReactNode } from "react";

export function PageScaffold({
  navigation,
  actions,
  children,
  description,
  eyebrow,
  mark,
  title,
  layout = "standard",
}: Readonly<{
  navigation?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  description?: string;
  eyebrow?: string;
  mark?: string;
  title: ReactNode;
  layout?: "standard" | "document";
}>) {
  return (
    <>
      {navigation === undefined ? null : (
        <div data-ui="document-navigation" className="cairn-PageNavigation">
          {navigation}
        </div>
      )}
      <main className="cairn-PageScaffold" data-layout={layout}>
        <header className="cairn-PageHeader">
          <div className="cairn-PageHeading">
            {eyebrow === undefined ? null : <p className="cairn-PageEyebrow">{eyebrow}</p>}
            <h1 className="cairn-PageTitle">
              {mark === undefined ? null : <img alt="" className="cairn-PageMark" src={mark} />}
              {title}
            </h1>
            {description === undefined ? null : <p className="cairn-PageDescription">{description}</p>}
          </div>
          {actions === undefined ? null : <div className="cairn-PageActions">{actions}</div>}
        </header>
        <div className="cairn-PageBody">{children}</div>
      </main>
    </>
  );
}
