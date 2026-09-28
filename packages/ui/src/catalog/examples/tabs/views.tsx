import { Tabs, Text } from "@cairn/ui";

export default function TabsViews() {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List aria-label="Project views">
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        <Tabs.Trigger disabled value="billing">
          Billing
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">
        <Text tone="muted">A summary of the project and its milestones.</Text>
      </Tabs.Content>
      <Tabs.Content value="activity">
        <Text tone="muted">Recent changes by everyone on the project.</Text>
      </Tabs.Content>
      <Tabs.Content value="settings">
        <Text tone="muted">Members, permissions, and integrations.</Text>
      </Tabs.Content>
    </Tabs.Root>
  );
}
