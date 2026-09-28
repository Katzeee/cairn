import { Flex, Grid, Icon, Text, iconNames } from "@cairn/ui";

export default function IconGallery() {
  return (
    <Flex direction="column" gap="5">
      <Flex align="center" gap="4">
        <Icon name="compass" size="xs" />
        <Icon name="compass" size="sm" />
        <Icon name="compass" />
        <Icon label="Explore" name="compass" size="lg" />
      </Flex>
      <Grid columns={{ initial: "2", sm: "4", md: "6" }} gap="3">
        {iconNames.map((name) => (
          <Flex align="center" direction="column" gap="2" key={name} p="2">
            <Icon name={name} />
            <Text size="caption" tone="muted">
              {name}
            </Text>
          </Flex>
        ))}
      </Grid>
    </Flex>
  );
}
