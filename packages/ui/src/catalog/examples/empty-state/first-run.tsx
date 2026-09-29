import { Button, EmptyState, Icon } from "@cairn/ui";

export default function EmptyStateFirstRun() {
  return (
    <EmptyState>
      <EmptyState.Illustration>
        <Icon name="app-window" size="lg" />
      </EmptyState.Illustration>
      <EmptyState.Title>No connected instances yet</EmptyState.Title>
      <EmptyState.Description>
        Load a Flint Bridge in Maya, Blender, Unity, or Python to establish a connection.
      </EmptyState.Description>
      <EmptyState.Actions>
        <Button>Read the setup guide</Button>
      </EmptyState.Actions>
    </EmptyState>
  );
}
