import { useState } from "react";
import { AppShell, Box, EmptyState, List, ListDetail, PageBar, Text, toast, type ListDetailPane } from "@cairn/ui";

const threads = [
  { id: "launch", title: "Launch checklist", from: "Mira", date: "Sep 28", body: "Final review is scheduled for Thursday." },
  { id: "design", title: "Design critique", from: "Theo", date: "Sep 27", body: "Notes from the forest theme review." },
  { id: "hiring", title: "Hiring loop", from: "Ada", date: "Sep 25", body: "Two candidates are ready for the final round." },
  { id: "billing", title: "Billing migration", from: "Sol", date: "Sep 22", body: "The new invoices go out on the first." },
];

export default function ListDetailInbox() {
  const [selected, setSelected] = useState<string>();
  const [pane, setPane] = useState<ListDetailPane>("list");
  const thread = threads.find(({ id }) => id === selected);
  return (
    <AppShell.Root scroll="panes">
      <AppShell.Main>
        <ListDetail.Root onPaneChange={setPane} pane={pane}>
          <ListDetail.List label="Inbox">
            <PageBar.Root>
              <PageBar.Title>Inbox</PageBar.Title>
              <PageBar.Action icon="pencil" label="New message" onSelect={() => toast({ title: "New message" })} placement="primary" />
            </PageBar.Root>
            <List.Root>
              {threads.map(({ id, title, from, date }) => (
                <List.Item description={from} key={id} onClick={() => setSelected(id)} selected={id === selected} trailing={date}>
                  {title}
                </List.Item>
              ))}
            </List.Root>
          </ListDetail.List>
          <ListDetail.Detail label="Message">
            {thread === undefined ? (
              <Box p="5">
                <EmptyState>
                  <EmptyState.Title>No message selected</EmptyState.Title>
                  <EmptyState.Description>Choose a message from the inbox to read it here.</EmptyState.Description>
                </EmptyState>
              </Box>
            ) : (
              <>
                <PageBar.Root>
                  <PageBar.Title>{thread.title}</PageBar.Title>
                  <PageBar.Subtitle>{thread.from}</PageBar.Subtitle>
                  <PageBar.Action icon="trash" label="Delete" onSelect={() => toast({ title: "Deleted" })} />
                </PageBar.Root>
                <Box p="5">
                  <Text as="p">{thread.body}</Text>
                </Box>
              </>
            )}
          </ListDetail.Detail>
        </ListDetail.Root>
      </AppShell.Main>
    </AppShell.Root>
  );
}
