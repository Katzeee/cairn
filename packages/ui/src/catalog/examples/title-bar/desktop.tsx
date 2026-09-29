import { ArrowLeft, Search, Settings } from "lucide-react";
import { Box, Flex, Heading, Icon, IconButton, Text, TextField, TitleBar, Tooltip } from "@cairn/ui";

export default function TitleBarDesktop() {
  return (
    <Flex direction="column" height="100%">
      <TitleBar.Root>
        <TitleBar.Leading>
          <Tooltip content="Back">
            <IconButton aria-label="Back" size="sm" variant="ghost">
              <Icon glyph={ArrowLeft} size="sm" />
            </IconButton>
          </Tooltip>
        </TitleBar.Leading>
        <TitleBar.Title>Flint</TitleBar.Title>
        <TitleBar.Content>
          <TextField.Root aria-label="Search workflows" placeholder="Search workflows" size="sm">
            <TextField.Slot>
              <Icon glyph={Search} size="sm" />
            </TextField.Slot>
          </TextField.Root>
        </TitleBar.Content>
        <TitleBar.Trailing>
          <Tooltip content="Settings">
            <IconButton aria-label="Settings" size="sm" variant="ghost">
              <Icon glyph={Settings} size="sm" />
            </IconButton>
          </Tooltip>
        </TitleBar.Trailing>
      </TitleBar.Root>
      <Box p="5">
        <Heading as="h1" size="title-small">Workflows</Heading>
        <Text as="p" tone="muted">Content scrolls below the title bar.</Text>
      </Box>
    </Flex>
  );
}
