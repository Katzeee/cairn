import { Flex, Separator, Switch } from "@cairn/ui";

export default function SwitchSettings() {
  return (
    <Flex direction="column" gap="4">
      <Switch defaultChecked description="Keep Flint in the system tray when the window closes." label="Run in background" />
      <Separator />
      <Switch description="Share anonymous usage to improve Flint." label="Usage statistics" />
      <Separator />
      <Switch disabled label="Beta features" />
    </Flex>
  );
}
