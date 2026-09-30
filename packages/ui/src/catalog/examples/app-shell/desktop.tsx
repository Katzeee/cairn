import { useState } from "react";
import { AppWindow, History, ListTree, Plus, RefreshCw, Settings } from "lucide-react";
import { AppShell, Box, PageBar, Status, Text, toast, type IconGlyph } from "@cairn/ui";

type Page = readonly [id: string, label: string, icon: IconGlyph, count?: number];

const groups: readonly { label: string; pages: readonly Page[] }[] = [
  {
    label: "Work",
    pages: [
      ["workflows", "Workflows", ListTree, 12],
      ["instances", "Instances", AppWindow, 3],
    ],
  },
  { label: "Records", pages: [["history", "History", History]] },
];

export default function AppShellDesktop() {
  const [active, setActive] = useState("workflows");
  const title = groups.flatMap((group) => group.pages).find(([id]) => id === active)?.[1];
  return (
    <AppShell.Root scroll="panes" windowChrome={{}}>
      <AppShell.Navigation collapsible>
        {groups.map((group) => (
          <AppShell.NavGroup key={group.label} label={group.label}>
            {group.pages.map(([id, label, icon, count]) => (
              <AppShell.NavItem
                active={id === active}
                href={`#/${id}`}
                icon={icon}
                key={id}
                onClick={(event) => {
                  event.preventDefault();
                  setActive(id);
                }}
                badge={count}
              >
                {label}
              </AppShell.NavItem>
            ))}
          </AppShell.NavGroup>
        ))}
        <AppShell.NavGroup placement="end">
          <AppShell.NavAction icon={Settings} onClick={() => toast({ title: "Settings open in their own window." })}>
            Settings
          </AppShell.NavAction>
        </AppShell.NavGroup>
        <AppShell.NavFooter>
          <Status tone="success">Sync running</Status>
        </AppShell.NavFooter>
      </AppShell.Navigation>
      <AppShell.Main>
        <PageBar.Root>
          <PageBar.Title>{title}</PageBar.Title>
          <PageBar.Action icon={RefreshCw} label="Refresh" onSelect={() => toast({ title: "Refreshed" })} />
          <PageBar.Action icon={Plus} label="New workflow" onSelect={() => toast({ title: "New workflow" })} priority="primary" />
        </PageBar.Root>
        <Box p="5">
          <Text as="p" tone="muted">
            The window's top row holds the sidebar toggle and this page's bar. Hiding the sidebar gives this pane the full width; a narrow window shows the destinations as a rail.
          </Text>
        </Box>
      </AppShell.Main>
    </AppShell.Root>
  );
}
