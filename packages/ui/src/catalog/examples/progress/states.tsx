import { Flex, Progress } from "@cairn/ui";

export default function ProgressStates() {
  return (
    <Flex direction="column" gap="5">
      <Progress label="Uploading assets" value={64} />
      <Progress label="Storage used" tone="warning" value={92} />
      <Progress aria-label="Preparing workspace" value={null} />
    </Flex>
  );
}
