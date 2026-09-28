import { useState } from "react";
import { Flex, NavRailItem, Text } from "@cairn/ui";

const items = [
  { id: "home", label: "Home", icon: "house" },
  { id: "explore", label: "Explore", icon: "compass" },
  { id: "messages", label: "Messages", icon: "messages-square" },
] as const;

export default function NavItemRail() {
  const [active, setActive] = useState<string>("home");
  return (
    <Flex direction="column" gap="3">
      <Flex as="nav" aria-label="Primary" gap="1">
        {items.map((item) => (
          <NavRailItem active={active === item.id} href={"#/" + item.id} icon={item.icon} label={item.label} key={item.id}
            onClick={(event) => { event.preventDefault(); setActive(item.id); }} />
        ))}
      </Flex>
      <Text as="p" aria-live="polite">{items.find((item) => item.id === active)?.label}</Text>
    </Flex>
  );
}
