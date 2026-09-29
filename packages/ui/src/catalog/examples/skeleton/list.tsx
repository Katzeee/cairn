import { Box, List, Skeleton } from "@cairn/ui";

const placeholders = ["Export scene assets", "Rebuild lighting", "Publish animation"];

export default function SkeletonList() {
  return (
    <Box aria-busy>
      <List.Root label="Workflows">
        {placeholders.map((name) => (
          <List.Item key={name} inert description={<Skeleton>12 executions · Yesterday</Skeleton>}>
            <Skeleton>{name}</Skeleton>
          </List.Item>
        ))}
      </List.Root>
    </Box>
  );
}
