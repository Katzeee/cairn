import { Badge, Button, Card, Flex, Grid, Heading, Image, Text, toast } from "@cairn/ui";

const screenshot = (fill: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="640" height="400" fill="${fill}"/><rect x="0" y="0" width="640" height="36" fill="black" fill-opacity="0.25"/></svg>`,
  )}`;

const instances = [
  { id: "4412", name: "Blender", detail: "scene.blend", preview: screenshot("slategray"), ready: true },
  { id: "5120", name: "Maya 2025", detail: "rig_v3.ma", preview: "data:image/png;base64,broken", ready: true },
  { id: "6031", name: "Unity", detail: "Starting", preview: undefined, ready: false },
];

export default function CardLink() {
  return (
    <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="4">
      {instances.map(({ id, name, detail, preview, ready }) => (
        <Card as="article" key={id}>
          <Card.Media>
            <Image alt="" aspectRatio="16/10" src={preview} />
          </Card.Media>
          <Flex direction="column" gap="3">
            <Flex direction="column" gap="1">
              <Heading as="h3" size="body-large">
                <Card.Link
                  href={`#/apps/${id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    toast({ title: `Open ${name}` });
                  }}
                >
                  {name}
                </Card.Link>
              </Heading>
              <Text size="label" tone="muted">
                PID {id} · {detail}
              </Text>
            </Flex>
            <Flex align="center" justify="between" gap="2">
              <Badge tone={ready ? "success" : "warning"}>{ready ? "Ready" : "Connecting"}</Badge>
              <Button onClick={() => toast({ title: `Detached ${name}` })} size="sm" variant="ghost">
                Detach
              </Button>
            </Flex>
          </Flex>
        </Card>
      ))}
    </Grid>
  );
}
