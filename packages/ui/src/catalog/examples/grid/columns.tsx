import { Grid } from "@cairn/ui";

export default function GridColumns() {
  return (
    <Grid columns="3" rows="repeat(2, var(--cairn-space-9))" gap="3">
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
    </Grid>
  );
}

function DecorativeBox() {
  return (
    <div aria-hidden="true" style={{
      height: "100%",
      borderRadius: "var(--cairn-radius-indicator)",
      backgroundColor: "var(--cairn-accent-subtle-active)",
      boxShadow: "inset 0 0 0 var(--cairn-border-width) var(--cairn-accent-border-strong)",
    }} />
  );
}
