import { useState } from "react";
import { AppWindow, History, ListTree, Plus, RefreshCw, Settings } from "lucide-react";
import { AppShell, Box, PageBar, Text, toast, type IconGlyph } from "@cairn/ui";

const groups: readonly { label: string; pages: readonly (readonly [id: string, label: string, icon: IconGlyph])[] }[] = [
  {
    label: "Work",
    pages: [
      ["workflows", "Workflows", ListTree],
      ["instances", "Instances", AppWindow],
    ],
  },
  { label: "Records", pages: [["history", "History", History]] },
];

export default function AppShellDesktop() {
  const [active, setActive] = useState("workflows");
  const title = groups.flatMap((group) => group.pages).find(([id]) => id === active)?.[1];
  return (
    <AppShell.Root scroll="panes" windowChrome={{}}>
      <AppShell.Sidebar collapsible>
        {groups.map((group) => (
          <AppShell.NavGroup key={group.label} label={group.label}>
            {group.pages.map(([id, label, icon]) => (
              <AppShell.NavItem
                active={id === active}
                href={`#/${id}`}
                icon={icon}
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
        <AppShell.SidebarFooter>
          <AppShell.NavAction icon={Settings} onClick={() => toast({ title: "Settings open in their own window." })}>
            Settings
          </AppShell.NavAction>
        </AppShell.SidebarFooter>
      </AppShell.Sidebar>
      <AppShell.Main>
        <PageBar.Root>
          <PageBar.Title>{title}</PageBar.Title>
          <PageBar.Action icon={RefreshCw} label="Refresh" onSelect={() => toast({ title: "Refreshed" })} />
          <PageBar.Action icon={Plus} label="New workflow" onSelect={() => toast({ title: "New workflow" })} placement="primary" />
        </PageBar.Root>
        <Box p="5">
          <Text as="p" tone="muted">
            The window's top row holds the sidebar toggle and this page's bar. Hiding the sidebar gives this pane the full width.
          </Text>
        </Box>
      </AppShell.Main>
    </AppShell.Root>
  );
}
