import { useState } from "react";
import { Flex, NavItem, NavSectionLabel, Text } from "@cairn/ui";

const items = [
  { id: "inbox", label: "Inbox", icon: "messages-square" },
  { id: "projects", label: "Projects", icon: "layers" },
  { id: "settings", label: "Settings", icon: "settings" },
] as const;

export default function NavItemSidebar() {
  const [active, setActive] = useState<string>("inbox");
  return (
    <Flex direction="column" gap="3">
      <Flex as="nav" aria-label="Workspace" direction="column" gap="1">
        <NavSectionLabel>Workspace</NavSectionLabel>
        {items.map((item) => (
          <NavItem active={active === item.id} href={"#/" + item.id} icon={item.icon} key={item.id}
            onClick={(event) => { event.preventDefault(); setActive(item.id); }}>
            {item.label}
          </NavItem>
        ))}
      </Flex>
      <Text as="p" aria-live="polite">{items.find((item) => item.id === active)?.label}</Text>
    </Flex>
  );
}
