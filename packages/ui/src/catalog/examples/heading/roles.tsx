import { Flex, Heading } from "@cairn/ui";

export default function HeadingRoles() {
  return (
    <Flex direction="column" gap="2">
      <Heading as="h1" size="display">
        Display
      </Heading>
      <Heading as="h2" size="page-title">
        Page title
      </Heading>
      <Heading as="h3" size="title">
        Title
      </Heading>
      <Heading as="h4" size="title-small">
        Title small
      </Heading>
    </Flex>
  );
}
