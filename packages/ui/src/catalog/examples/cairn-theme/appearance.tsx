import { Button, CairnTheme, Flex, Text } from "@cairn/ui";

// CairnTheme sets appearance on the document root, so overlays follow it too.
// The theme itself is chosen by importing one theme stylesheet, such as "@cairn/ui/themes/forest.css".
export default function CairnThemeAppearance() {
  return (
    <CairnTheme appearance="inherit">
      <Flex align="center" gap="3" wrap="wrap">
        <Text tone="muted">Follows the system light or dark preference.</Text>
        <Button variant="outline">Themed action</Button>
      </Flex>
    </CairnTheme>
  );
}
