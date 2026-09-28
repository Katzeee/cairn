import { Button, Card, PageScaffold, Text } from "@cairn/ui";

export default function PageScaffoldStandard() {
  return (
    <PageScaffold
      actions={<Button size="sm">Create project</Button>}
      description="Everything your team is building, grouped by status."
      eyebrow="Workspace"
      title="Projects"
    >
      <Card>
        <Text as="p" tone="muted">
          Page content sits below the header at the shared content width.
        </Text>
      </Card>
    </PageScaffold>
  );
}
