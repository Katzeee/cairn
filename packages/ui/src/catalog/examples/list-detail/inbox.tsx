import { useState } from "react";
import { Box, Button, Flex, Heading, ListDetail, Text } from "@cairn/ui";

const threads = [
  { id: "launch", title: "Launch checklist", body: "Final review is scheduled for Thursday." },
  { id: "design", title: "Design critique", body: "Notes from the forest theme review." },
];

export default function ListDetailInbox() {
  const [selected, setSelected] = useState<string | null>(null);
  const thread = threads.find(({ id }) => id === selected) ?? threads[0]!;
  return (
    <ListDetail
      detail={
        <Box p="5">
          <Heading as="h3" size="title-small">
            {thread.title}
          </Heading>
          <Text as="p" tone="muted">
            {thread.body}
          </Text>
        </Box>
      }
      detailVisible={selected !== null}
      list={
        <Flex direction="column" gap="1" p="3">
          {threads.map(({ id, title }) => (
            <Button
              aria-pressed={id === thread.id}
              key={id}
              onClick={() => setSelected(id)}
              variant={id === thread.id ? "secondary" : "ghost"}
            >
              {title}
            </Button>
          ))}
        </Flex>
      }
      onBack={() => setSelected(null)}
    />
  );
}
