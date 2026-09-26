import { useState } from "react";

import { StyledButton } from "../components/button.js";
import { Box, Container, Flex, Grid, Section } from "../components/layout.js";
import { ListDetail } from "../components/list-detail.js";
import { PageIntro, Specimen } from "./specimen.js";

const workspaces = [
  { id: "field-notes", name: "Field notes", summary: "12 documents · updated today" },
  { id: "research", name: "Research", summary: "8 documents · updated yesterday" },
  { id: "archive", name: "Archive", summary: "31 documents · updated last week" },
] as const;

export function LayoutPage() {
  const [selectedId, setSelectedId] = useState<(typeof workspaces)[number]["id"] | null>(null);
  const selected = workspaces.find(({ id }) => id === selectedId) ?? workspaces[0];
  return (
    <>
      <PageIntro
        description="AppShell chooses bottom navigation, an icon rail, or a full sidebar from its own container. PageScaffold supplies the shared header, actions, content width, and safe gutter."
        title="Responsive layouts"
      />
      <Specimen
        className="block p-0"
        description="Narrow containers push from the list into a detail view. Expanded containers keep both panes visible, so the same state model works at every size."
        title="List and detail"
      >
        <ListDetail
          detail={
            <article className="p-6">
              <p className="text-caption font-semibold tracking-widest text-primary uppercase">Workspace</p>
              <h3 className="mt-2 text-title font-semibold">{selected.name}</h3>
              <p className="mt-2 text-body text-muted-foreground">{selected.summary}</p>
              <p className="mt-6 max-w-150 text-body">
                Documents, members, and recent activity belong here. Selecting another workspace updates this pane
                without changing the layout contract.
              </p>
            </article>
          }
          detailVisible={selectedId !== null}
          list={
            <div className="flex flex-col gap-1 p-3">
              {workspaces.map((workspace) => (
                <StyledButton
                  className="h-auto justify-start px-3 py-3 text-left"
                  key={workspace.id}
                  onClick={() => setSelectedId(workspace.id)}
                  variant={workspace.id === selected.id ? "secondary" : "ghost"}
                >
                  <span>
                    <span className="block text-label font-semibold text-foreground">{workspace.name}</span>
                    <span className="mt-0.5 block text-caption text-muted-foreground">{workspace.summary}</span>
                  </span>
                </StyledButton>
              ))}
            </div>
          }
          onBack={() => setSelectedId(null)}
        />
      </Specimen>
      <Specimen
        className="flex-col flex-nowrap items-stretch"
        description="Box, Flex, and Grid space children with steps 0–9 of the shared scale. Responsive objects switch values at Cairn breakpoints; siblings are separated by the parent gap, never by margins."
        title="Layout primitives"
      >
        <Flex align="center" gap="3" justify="between" wrap="wrap">
          <Tile label="Flex start" />
          <Flex gap="2">
            <Tile label="gap 2" />
            <Tile label="gap 2" />
          </Flex>
        </Flex>
        <Grid columns={{ initial: "1", md: "2", lg: "4" }} gap="3">
          {["One", "Two", "Three", "Four"].map((label) => (
            <Tile key={label} label={label} />
          ))}
        </Grid>
        <Box p="4">
          <Tile label="Box with p 4" />
        </Box>
      </Specimen>
      <Specimen
        className="block p-0"
        description="Container caps content at the reading, document, standard, or wide measure. Section sets the vertical rhythm between page regions."
        title="Container and Section"
      >
        <Section size="1">
          <Container px="4" size="1">
            <Tile label="Container size 1 inside Section size 1" />
          </Container>
        </Section>
      </Specimen>
    </>
  );
}

function Tile({ label }: Readonly<{ label: string }>) {
  return <div className="rounded-sm bg-muted px-3 py-2 text-caption text-muted-foreground">{label}</div>;
}
