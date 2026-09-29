import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { Callout, Flex, Icon } from "@cairn/ui";

export default function CalloutTones() {
  return (
    <Flex direction="column" gap="3">
      <Callout.Root>
        <Callout.Body>
          <Callout.Text>Changes sync when you reconnect.</Callout.Text>
        </Callout.Body>
      </Callout.Root>
      <Callout.Root tone="info">
        <Callout.Icon>
          <Icon glyph={Info} size="sm" />
        </Callout.Icon>
        <Callout.Body>
          <Callout.Title>New version available</Callout.Title>
          <Callout.Text>Restart to update to 2.4.</Callout.Text>
        </Callout.Body>
      </Callout.Root>
      <Callout.Root tone="success">
        <Callout.Icon>
          <Icon glyph={CircleCheck} size="sm" />
        </Callout.Icon>
        <Callout.Body>
          <Callout.Text>Your workspace is backed up.</Callout.Text>
        </Callout.Body>
      </Callout.Root>
      <Callout.Root tone="warning">
        <Callout.Icon>
          <Icon glyph={TriangleAlert} size="sm" />
        </Callout.Icon>
        <Callout.Body>
          <Callout.Text>Storage is 90% full.</Callout.Text>
        </Callout.Body>
      </Callout.Root>
      <Callout.Root tone="danger">
        <Callout.Icon>
          <Icon glyph={CircleAlert} size="sm" />
        </Callout.Icon>
        <Callout.Body>
          <Callout.Title>Flint could not reach the backend</Callout.Title>
          <Callout.Text>Check that the service is running, then try again.</Callout.Text>
        </Callout.Body>
      </Callout.Root>
    </Flex>
  );
}
