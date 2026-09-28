import { useState } from "react";
import { Breadcrumbs, Flex, Text } from "@cairn/ui";

const trail = ["Workspace", "Projects", "Cairn", "Roadmap"];

export default function BreadcrumbsTrail() {
  const [current, setCurrent] = useState("Roadmap");
  return (
    <Flex direction="column" gap="3">
      <Breadcrumbs items={trail.map((label) => ({ label, current: label === current, onSelect: () => setCurrent(label) }))} />
      <Text as="p" aria-live="polite">{current}</Text>
    </Flex>
  );
}
