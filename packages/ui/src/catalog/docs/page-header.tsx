import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: Readonly<{ eyebrow?: string; title: string; description: string; children?: ReactNode }>) {
  return (
    <header className="cairn-CatalogHeader">
      {eyebrow === undefined ? null : <p className="cairn-CatalogEyebrow">{eyebrow}</p>}
      <h1 className="cairn-CatalogTitle">{title}</h1>
      <p className="cairn-CatalogLead">{description}</p>
      {children}
    </header>
  );
}

export function CatalogSection({
  id,
  title,
  description,
  children,
}: Readonly<{ id?: string; title: string; description?: ReactNode; children: ReactNode }>) {
  return (
    <section className="cairn-CatalogSection" id={id}>
      <h2 className="cairn-CatalogSectionTitle">{title}</h2>
      {description === undefined ? null : <p className="cairn-CatalogSectionDescription">{description}</p>}
      {children}
    </section>
  );
}
