import { useState } from "react";
import { AppShell, Box, Heading, Text } from "@cairn/ui";

const pages = {
  inbox: ["Inbox", "Your latest conversations appear here."],
  projects: ["Projects", "Browse the projects in your workspace."],
  templates: ["Templates", "Choose a template for your next project."],
  settings: ["Settings", "Manage your workspace preferences."],
} as const;

export default function AppShellSidebar() {
  const [active, setActive] = useState<keyof typeof pages>("inbox");
  return (
    <Box height="100%" onClick={(event) => {
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      const id = anchor?.getAttribute("href")?.replace("#/", "");
      if (id && Object.hasOwn(pages, id)) {
        event.preventDefault();
        setActive(id as keyof typeof pages);
      }
    }}>
      <AppShell
        activeItemId={active}
        brand="Flint"
        sections={[
          {
            id: "work",
            label: "Work",
            items: [
              { id: "inbox", label: "Inbox", target: "#/inbox", icon: "messages-square" },
              { id: "projects", label: "Projects", target: "#/projects", icon: "layers" },
            ],
          },
          {
            id: "library",
            label: "Library",
            items: [{ id: "templates", label: "Templates", target: "#/templates", icon: "layout-template" }],
          },
        ]}
        utilities={[{ id: "settings", label: "Settings", icon: "settings", onSelect: () => setActive("settings") }]}
      >
        <Heading as="h3" size="title-small">{pages[active][0]}</Heading>
        <Text as="p" tone="muted">{pages[active][1]}</Text>
      </AppShell>
    </Box>
  );
}
