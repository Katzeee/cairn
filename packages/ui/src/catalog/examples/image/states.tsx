import { Grid, Image, Text, Flex } from "@cairn/ui";

const picture = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="640" height="400" fill="steelblue"/><circle cx="480" cy="120" r="60" fill="khaki"/><path d="M0 400 L220 180 L400 400 Z" fill="seagreen"/></svg>',
)}`;

const states = [
  { label: "Loaded", src: picture },
  { label: "Failed", src: "data:image/png;base64,broken" },
  { label: "No picture", src: undefined },
];

export default function ImageStates() {
  return (
    <Grid columns={{ initial: "1", sm: "3" }} gap="4">
      {states.map(({ label, src }) => (
        <Flex direction="column" gap="2" key={label}>
          <Image alt={`${label} example`} aspectRatio="16/10" src={src} />
          <Text size="label" tone="muted">
            {label}
          </Text>
        </Flex>
      ))}
    </Grid>
  );
}
