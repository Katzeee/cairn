import { useState } from "react";
import { Compass, House, MessagesSquare, Settings } from "lucide-react";
import { AppShell, Box, PageBar, Text, type IconGlyph } from "@cairn/ui";

const destinations: readonly (readonly [id: string, label: string, icon: IconGlyph, badge?: number])[] = [
  ["home", "Home", House],
  ["explore", "Explore", Compass],
  ["messages", "Messages", MessagesSquare, 4],
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
          <Text as="p" tone="muted">A few destinations sit along the bottom edge of a compact shell, beside the content as a rail when it is wider or too short to spare the row, and in a sidebar once it is expanded.</Text>
        </Box>
      </AppShell.Main>
      <AppShell.Navigation>
        {destinations.map(([id, label, icon, badge]) => (
          <AppShell.NavItem
            active={id === active}
            badge={badge}
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
      </AppShell.Navigation>
    </AppShell.Root>
  );
}
