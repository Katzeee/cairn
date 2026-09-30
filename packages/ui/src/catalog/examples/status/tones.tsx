import { Flex, Status } from "@cairn/ui";

export default function StatusTones() {
  return (
    <Flex direction="column" gap="2">
      <Status>Stopped</Status>
      <Status tone="success">Running</Status>
      <Status tone="info">Syncing</Status>
      <Status tone="warning">Reconnecting</Status>
      <Status tone="danger">Unavailable</Status>
    </Flex>
  );
}
