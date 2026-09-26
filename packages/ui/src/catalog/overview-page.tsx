import { Badge } from "../components/badge.js";
import { Button } from "../components/button.js";
import { Card, CardContent, CardDescription, CardTitle } from "../components/card.js";
import { Flex, Grid } from "../components/layout.js";
import { PageIntro, Specimen } from "./specimen.js";

const principles = [
  {
    title: "One token source",
    detail:
      "Every color, size, radius, and duration resolves from the design-tokens package. Components and screens never carry raw values.",
  },
  {
    title: "One component layer",
    detail:
      "Product screens render exclusively through the ui components. A visual change lands in one file and reaches every surface.",
  },
  {
    title: "Modes, themes, one vocabulary",
    detail:
      "Light and dark modes, forest and slate themes, and application-wide token settings all resolve the same semantic roles. Component props express their own intended variants and sizes.",
  },
] as const;

export function OverviewPage() {
  return (
    <>
      <PageIntro
        description="The interface system behind every Cairn surface: paper-calm in the light, forest-deep in the dark, HarmonyOS Sans throughout."
        title="Cairn Design System"
      />
      <div className="mb-10">
        <Grid columns={{ initial: "1", lg: "3" }} gap="4">
          {principles.map((principle) => (
            <Card key={principle.title}>
              <CardContent>
                <Flex direction="column" gap="2">
                  <CardTitle>{principle.title}</CardTitle>
                  <CardDescription>{principle.detail}</CardDescription>
                </Flex>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </div>
      <Specimen description="A quick taste of the working component layer." title="At a glance">
        <Button>Primary action</Button>
        <Button variant="outline">Outline</Button>
        <Badge tone="success">Ready</Badge>
        <Badge tone="accent">Local-first</Badge>
      </Specimen>
    </>
  );
}
