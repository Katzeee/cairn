import { Compass } from "lucide-react";
import { Flex, Icon, type IconGlyphProps } from "@cairn/ui";

function Waypoint(props: IconGlyphProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" {...props}>
      <path d="M12 3 20 12 12 21 4 12Z" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export default function IconSources() {
  return (
    <Flex direction="column" gap="5">
      <Flex align="center" gap="4">
        <Icon glyph={Compass} size="xs" />
        <Icon glyph={Compass} size="sm" />
        <Icon glyph={Compass} />
        <Icon glyph={Compass} label="Explore" size="lg" />
      </Flex>
      <Flex align="center" gap="4">
        <Icon glyph={Waypoint} size="sm" />
        <Icon glyph={Waypoint} />
        <Icon glyph={Waypoint} label="Waypoint" size="lg" />
      </Flex>
    </Flex>
  );
}
