import { useState } from "react";
import { Button, Flex, Image, Text } from "@cairn/ui";

const frame = (hue: string, label: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="640" height="400" fill="${hue}"/><text x="320" y="215" font-family="sans-serif" font-size="48" text-anchor="middle" fill="white">${label}</text></svg>`,
  )}`;

const frames = [frame("teal", "Frame 1"), frame("indigo", "Frame 2"), frame("sienna", "Frame 3")];

export default function ImageRefresh() {
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState(false);
  return (
    <Flex direction="column" gap="3" maxWidth="var(--cairn-container-1)">
      <Image alt="Blender window" aspectRatio="16/10" src={broken ? "data:image/png;base64,broken" : frames[index % frames.length]} />
      <Text size="label" tone="muted">
        A new picture replaces the last one once it has loaded; a refresh that fails keeps the last picture.
      </Text>
      <Flex gap="2">
        <Button
          onClick={() => {
            setBroken(false);
            setIndex((current) => current + 1);
          }}
          size="sm"
          variant="outline"
        >
          Refresh
        </Button>
        <Button onClick={() => setBroken(true)} size="sm" variant="ghost">
          Refresh with a failure
        </Button>
      </Flex>
    </Flex>
  );
}
