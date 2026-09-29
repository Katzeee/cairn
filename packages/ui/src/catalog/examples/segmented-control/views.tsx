import { useState } from "react";
import { Flex, SegmentedControl, Text } from "@cairn/ui";

export default function SegmentedControlViews() {
  const [view, setView] = useState("board");
  return (
    <Flex align="start" direction="column" gap="3">
      <SegmentedControl.Root aria-label="View" onValueChange={setView} value={view}>
        <SegmentedControl.Item value="list">List</SegmentedControl.Item>
        <SegmentedControl.Item value="board">Board</SegmentedControl.Item>
        <SegmentedControl.Item value="calendar">Calendar</SegmentedControl.Item>
      </SegmentedControl.Root>
      <SegmentedControl.Root aria-label="Range" defaultValue="week" size="sm">
        <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
        <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
        <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
      </SegmentedControl.Root>
      <Text size="label" tone="muted">Showing the {view} view.</Text>
    </Flex>
  );
}
