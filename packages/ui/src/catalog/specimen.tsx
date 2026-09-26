import { createContext, useContext, type ReactNode } from "react";

import { Card } from "../components/card.js";
import { cn } from "../components/cn.js";

/** Reuse the same live specimens in focused reference pages and composition pages. */
export const SpecimenSelection = createContext<readonly string[] | null>(null);

export function PageIntro({ description, title }: Readonly<{ description: string; title: string }>) {
  const selection = useContext(SpecimenSelection);
  if (selection !== null) return null;
  return (
    <header className="mb-10">
      <h1 className="text-page-title font-medium tracking-tight">{title}</h1>
      <p className="mt-2 max-w-165 text-body-large text-muted-foreground">{description}</p>
    </header>
  );
}

export function Specimen(
  properties: Readonly<{ children: ReactNode; className?: string; description?: string; title: string }>,
) {
  const selection = useContext(SpecimenSelection);
  if (selection !== null && !selection.includes(properties.title)) return null;
  return (
    <section className="mb-8">
      <h2 className="text-title-small font-semibold tracking-tight">{properties.title}</h2>
      {properties.description === undefined ? null : (
        <p className="mt-1 text-body text-muted-foreground">{properties.description}</p>
      )}
      <div className="mt-4">
        <Card>
          <div className={cn("flex flex-wrap items-center gap-4 p-6", properties.className)}>{properties.children}</div>
        </Card>
      </div>
    </section>
  );
}
