import { Copy, Pencil, Share2, Trash2 } from "lucide-react";
import { Box, Card, Container, PageBar, Text, toast } from "@cairn/ui";

export default function PageBarActions() {
  const notify = (title: string) => () => toast({ title });
  return (
    <div>
      <PageBar.Root>
        <PageBar.Back label="Back to invoices" onSelect={notify("Back")} />
        <PageBar.Title>Invoice 1024</PageBar.Title>
        <PageBar.Subtitle>Due October 12</PageBar.Subtitle>
        <PageBar.Action icon={Share2} label="Share" onSelect={notify("Shared")} />
        <PageBar.Action icon={Copy} label="Duplicate" onSelect={notify("Duplicated")} />
        <PageBar.Action icon={Pencil} label="Edit" onSelect={notify("Editing")} placement="primary" />
        <PageBar.Action icon={Trash2} label="Delete" onSelect={notify("Deleted")} placement="secondary" />
      </PageBar.Root>
      <Container size="3">
        <Box p="5">
          <Card>
            <Text as="p" tone="muted">
              Narrow the preview: Edit drops its label, then Duplicate and Share move into More, and only then does the
              title truncate. Delete always lives in More.
            </Text>
          </Card>
        </Box>
      </Container>
    </div>
  );
}
