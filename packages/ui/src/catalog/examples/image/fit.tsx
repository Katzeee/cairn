import { Grid, Image, Text, Flex } from "@cairn/ui";

// A tall window screenshot in a wide frame.
const tall = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="500"><rect width="300" height="500" fill="slategray"/><rect x="20" y="20" width="260" height="40" fill="gainsboro"/><rect x="20" y="80" width="260" height="400" fill="whitesmoke"/></svg>',
)}`;

export default function ImageFit() {
  return (
    <Grid columns="2" gap="4">
      {(["cover", "contain"] as const).map((fit) => (
        <Flex direction="column" gap="2" key={fit}>
          <Image alt="Settings window" aspectRatio="16/10" fit={fit} src={tall} />
          <Text size="label" tone="muted">
            {fit === "cover" ? "Cover fills the frame and crops" : "Contain shows the whole picture"}
          </Text>
        </Flex>
      ))}
    </Grid>
  );
}
