import { useState } from "react";
import { Compass, House, MessagesSquare, Settings } from "lucide-react";
import { AppShell, Box, PageBar, Text, type IconGlyph } from "@cairn/ui";

const destinations: readonly (readonly [id: string, label: string, icon: IconGlyph])[] = [
  ["home", "Home", House],
  ["explore", "Explore", Compass],
  ["messages", "Messages", MessagesSquare],
  ["settings", "Settings", Settings],
];

export default function AppShellMobile() {
  const [active, setActive] = useState("home");
  const title = destinations.find(([id]) => id === active)?.[1];
  return (
    <AppShell.Root scroll="panes">
      <AppShell.Main>
        <PageBar.Root>
          <PageBar.Title>{title}</PageBar.Title>
        </PageBar.Root>
        <Box p="5">
          <Text as="p" tone="muted">The same tabs sit along the bottom edge until the shell is wide, or too short to spare the row; then they move beside the content.</Text>
        </Box>
      </AppShell.Main>
      <AppShell.TabBar>
        {destinations.map(([id, label, icon]) => (
          <AppShell.TabBarItem
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
          </AppShell.TabBarItem>
        ))}
      </AppShell.TabBar>
    </AppShell.Root>
  );
}
