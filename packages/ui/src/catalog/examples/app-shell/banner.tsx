import { useState } from "react";
import { AppWindow, CircleAlert, ListTree, Settings } from "lucide-react";
import { AppShell, Box, Button, Callout, Icon, PageBar, Text } from "@cairn/ui";

export default function AppShellBanner() {
  const [connected, setConnected] = useState(false);
  return (
    <AppShell.Root scroll="panes" windowChrome={{}}>
      <AppShell.Navigation collapsible>
        <AppShell.NavGroup>
          <AppShell.NavItem active href="#/workflows" icon={ListTree} onClick={(event) => event.preventDefault()}>
            Workflows
          </AppShell.NavItem>
          <AppShell.NavItem href="#/instances" icon={AppWindow} onClick={(event) => event.preventDefault()}>
            Instances
          </AppShell.NavItem>
        </AppShell.NavGroup>
        <AppShell.NavGroup placement="end">
          <AppShell.NavItem href="#/settings" icon={Settings} onClick={(event) => event.preventDefault()}>
            Settings
          </AppShell.NavItem>
        </AppShell.NavGroup>
      </AppShell.Navigation>
      {connected ? null : (
        <AppShell.Banner>
          <Callout.Root tone="danger">
            <Callout.Icon>
              <Icon glyph={CircleAlert} size="sm" />
            </Callout.Icon>
            <Callout.Body>
              <Callout.Text>The sync service is unavailable. Changes are kept on this device.</Callout.Text>
            </Callout.Body>
            <Callout.Actions>
              <Callout.Action label="Reconnect" onSelect={() => setConnected(true)} priority="primary" />
            </Callout.Actions>
          </Callout.Root>
        </AppShell.Banner>
      )}
      <AppShell.Main>
        <PageBar.Root>
          <PageBar.Title>Workflows</PageBar.Title>
        </PageBar.Root>
        <Box p="5">
          {connected ? (
            <Button onClick={() => setConnected(false)} variant="outline">
              Lose the connection
            </Button>
          ) : (
            <Text as="p" tone="muted">
              The banner stays above every page until the condition clears, whichever page is open.
            </Text>
          )}
        </Box>
      </AppShell.Main>
    </AppShell.Root>
  );
}
