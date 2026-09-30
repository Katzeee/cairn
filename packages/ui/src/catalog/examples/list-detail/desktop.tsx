import { useState } from "react";
import { Archive, Copy, NotebookText, Plus, Trash2 } from "lucide-react";
import { AppShell, Box, List, ListDetail, PageBar, Text, toast, type ListDetailPane } from "@cairn/ui";

const notes = [
  { id: "roadmap", title: "Roadmap", edited: "Today", body: "Adaptive layouts first, then the host adapters." },
  { id: "retro", title: "Sprint retro", edited: "Yesterday", body: "Keep the catalog review before every commit." },
  { id: "ideas", title: "Ideas", edited: "Sep 20", body: "A glass theme; a large-title page bar." },
];

export default function ListDetailDesktop() {
  const [selected, setSelected] = useState("roadmap");
  const [pane, setPane] = useState<ListDetailPane>("list");
  const note = notes.find(({ id }) => id === selected)!;
  return (
    <AppShell.Root scroll="panes" windowChrome={{}}>
      <AppShell.Navigation collapsible>
        <AppShell.NavGroup label="Library">
          <AppShell.NavItem active href="#/notes" icon={NotebookText} onClick={(event) => event.preventDefault()}>
            Notes
          </AppShell.NavItem>
          <AppShell.NavItem href="#/archive" icon={Archive} onClick={(event) => event.preventDefault()}>
            Archive
          </AppShell.NavItem>
        </AppShell.NavGroup>
      </AppShell.Navigation>
      <AppShell.Main>
        <ListDetail.Root onPaneChange={setPane} pane={pane}>
          <ListDetail.List label="Notes">
            <PageBar.Root>
              <PageBar.Title>Notes</PageBar.Title>
              <PageBar.Action icon={Plus} label="New note" onSelect={() => toast({ title: "New note" })} priority="primary" />
            </PageBar.Root>
            <List.Root>
              {notes.map(({ id, title, edited }) => (
                <List.Item description={edited} key={id} onClick={() => setSelected(id)} selected={id === selected}>
                  {title}
                </List.Item>
              ))}
            </List.Root>
          </ListDetail.List>
          <ListDetail.Detail label="Note">
            <PageBar.Root>
              <PageBar.Title>{note.title}</PageBar.Title>
              <PageBar.Action icon={Copy} label="Duplicate" onSelect={() => toast({ title: "Duplicated" })} />
              <PageBar.Action icon={Trash2} label="Delete" onSelect={() => toast({ title: "Deleted" })} priority="secondary" />
            </PageBar.Root>
            <Box p="5">
              <Text as="p">{note.body}</Text>
            </Box>
          </ListDetail.Detail>
        </ListDetail.Root>
      </AppShell.Main>
    </AppShell.Root>
  );
}
