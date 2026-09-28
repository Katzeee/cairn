import { useState } from "react";
import { AppShell, Box, Heading, Text } from "@cairn/ui";

const pages = {
  home: ["Home", "Your recent activity appears here."],
  explore: ["Explore", "Discover projects and ideas from your workspace."],
  messages: ["Messages", "Read conversations with your team."],
} as const;

export default function AppShellBottomBar() {
  const [active, setActive] = useState<keyof typeof pages>("home");
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
        sections={[
          {
            id: "main",
            items: [
              { id: "home", label: "Home", target: "#/home", icon: "house" },
              { id: "explore", label: "Explore", target: "#/explore", icon: "compass" },
              { id: "messages", label: "Messages", target: "#/messages", icon: "messages-square" },
            ],
          },
        ]}
      >
        <Box p="5">
          <Heading as="h3" size="title-small">{pages[active][0]}</Heading>
          <Text as="p" tone="muted">{pages[active][1]}</Text>
        </Box>
      </AppShell>
    </Box>
  );
}
