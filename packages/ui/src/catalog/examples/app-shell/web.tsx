import { useState } from "react";
import { AppShell, Box, Flex, Icon, IconButton, PageBar, Text, Tooltip, toast } from "@cairn/ui";

const groups: readonly { label: string; pages: readonly (readonly [id: string, label: string])[] }[] = [
  { label: "Get started", pages: [["introduction", "Introduction"], ["installation", "Installation"]] },
  { label: "Components", pages: [["buttons", "Buttons"], ["forms", "Forms"], ["tables", "Tables"]] },
  { label: "Project", pages: [["changelog", "Changelog"]] },
];

export default function AppShellWeb() {
  const [active, setActive] = useState("introduction");
  const title = groups.flatMap((group) => group.pages).find(([id]) => id === active)?.[1];
  return (
    <AppShell.Root>
      <AppShell.Header>
        <AppShell.SidebarToggle />
        <Text weight="semibold">Acme Docs</Text>
        <Flex flexGrow="1" justify="end">
          <Tooltip content="Search">
            <IconButton aria-label="Search" variant="ghost">
              <Icon name="search" />
            </IconButton>
          </Tooltip>
        </Flex>
      </AppShell.Header>
      <AppShell.Sidebar>
        {groups.map((group) => (
          <AppShell.NavGroup key={group.label} label={group.label}>
            {group.pages.map(([id, label]) => (
              <AppShell.NavItem
                active={id === active}
                href={`#/${id}`}
                key={id}
                onClick={(event) => {
                  event.preventDefault();
                  setActive(id);
                }}
              >
                {label}
              </AppShell.NavItem>
            ))}
          </AppShell.NavGroup>
        ))}
      </AppShell.Sidebar>
      <AppShell.Main>
        <PageBar.Root>
          <PageBar.Title>{title}</PageBar.Title>
          <PageBar.Action icon="pencil" label="Edit on GitHub" onSelect={() => toast({ title: "Opening the source" })} />
        </PageBar.Root>
        <Box p="5">
          <Text as="p" tone="muted">
            The sidebar stays in place while it fits. Below 840 pixels a menu button in the header opens it above the page.
          </Text>
        </Box>
      </AppShell.Main>
    </AppShell.Root>
  );
}
