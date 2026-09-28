import { Flex, Text } from "@cairn/ui";

export default function TextRoles() {
  return (
    <Flex direction="column" gap="2">
      <Text as="p" size="body-large">
        Body large introduces a page or section.
      </Text>
      <Text as="p">Body is the default for reading and interface text.</Text>
      <Text as="p" size="label" weight="medium">
        Label names controls and compact values.
      </Text>
      <Text as="p" size="caption" tone="muted">
        Caption carries metadata and supporting detail.
      </Text>
    </Flex>
  );
}
