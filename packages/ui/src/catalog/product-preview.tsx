import type { ReactNode } from "react";

import { Badge } from "../components/badge.js";
import { Button } from "../components/button.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/card.js";
import { PageScaffold } from "../components/page-scaffold.js";
import { PageIntro } from "./specimen.js";

export function ProductPreviewPage({ children }: Readonly<{ children?: ReactNode }>) {
  return (
    <>
      <PageIntro
        description="A complete page composed from Cairn components. Applications supply the content and actions while the component layer owns the visual structure."
        title="Product preview"
      />
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-md">
        {children ?? <DefaultPreview />}
      </div>
    </>
  );
}

function DefaultPreview() {
  return (
    <PageScaffold
      actions={<Button size="sm">Create project</Button>}
      description="A responsive workspace overview built from the same primitives shown throughout this catalog."
      eyebrow="Example page"
      title="Projects"
    >
      <div className="grid gap-4 @3xl/app-shell:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Design review</CardTitle>
            <CardDescription>Shared components and patterns for every application.</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge tone="success">Ready</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New workspace</CardTitle>
            <CardDescription>Start with the same visual rules and adapt the content to your product.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="sm" variant="outline">View details</Button>
          </CardContent>
        </Card>
      </div>
    </PageScaffold>
  );
}
