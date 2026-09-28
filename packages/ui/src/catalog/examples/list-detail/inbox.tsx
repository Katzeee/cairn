import { useState } from "react";
import { Box, Flex, Heading, ListDetail, NavItem, Text } from "@cairn/ui";

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
            <NavItem
              active={id === thread.id}
              href={`#${id}`}
              key={id}
              onClick={(event) => {
                event.preventDefault();
                setSelected(id);
              }}
            >
              {title}
            </NavItem>
          ))}
        </Flex>
      }
      onBack={() => setSelected(null)}
    />
  );
}
