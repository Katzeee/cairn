import { useState } from "react";
import { Button, Code, Flex, List, Select, Status, Switch, toast } from "@cairn/ui";

export default function ListSettings() {
  const [theme, setTheme] = useState("system");
  return (
    <Flex direction="column" gap="6">
      <List.Section title="Appearance">
        <List.Item
          control={
            <Select.Root onValueChange={setTheme} value={theme}>
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="system">System</Select.Item>
                <Select.Item value="light">Light</Select.Item>
                <Select.Item value="dark">Dark</Select.Item>
              </Select.Content>
            </Select.Root>
          }
        >
          Theme
        </List.Item>
        <List.Item control={<Switch defaultChecked />} description="Closing the window keeps the service running in the system tray.">
          Run in background
        </List.Item>
      </List.Section>

      <List.Section title="Service">
        <List.Item trailing={<Status tone="success">Running</Status>}>Status</List.Item>
        <List.Item trailing={<Code>127.0.0.1:47100</Code>}>Address</List.Item>
        <List.Item trailing="C:\Users\ada\AppData\Local\Example\state">Data directory</List.Item>
      </List.Section>

      <List.Section description="Connected clients disconnect until the service starts again.">
        <List.Item
          description="Stops the service and closes the application."
          trailing={
            <Button onClick={() => toast({ title: "Stopping service" })} size="sm" variant="destructive">
              Stop
            </Button>
          }
        >
          Stop service
        </List.Item>
      </List.Section>

      <List.Section title="About">
        <List.Item trailing="2.4.0">Version</List.Item>
        <List.Item href="#licenses">Open-source licenses</List.Item>
      </List.Section>
    </Flex>
  );
}
