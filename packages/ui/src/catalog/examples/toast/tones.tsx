import { Button, Flex, toast } from "@cairn/ui";

// Render ToastProvider once near the application root.
export default function ToastTones() {
  return (
    <Flex gap="2" wrap="wrap">
      <Button onClick={() => toast({ title: "Draft saved" })} variant="outline">
        Neutral
      </Button>
      <Button
        onClick={() => toast({ title: "Bridge connected", description: "Maya 2025 is ready.", tone: "success" })}
        variant="outline"
      >
        Success
      </Button>
      <Button
        onClick={() =>
          toast({
            title: "Connection lost",
            description: "Flint will retry in 10 seconds.",
            tone: "danger",
            action: { label: "Retry now", onPress: () => toast({ title: "Connection restored", tone: "success" }) },
          })
        }
        variant="outline"
      >
        Danger with action
      </Button>
    </Flex>
  );
}
