import { AlertDialog, Button } from "@cairn/ui";

export default function AlertDialogConfirm() {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button variant="destructive">Stop backend</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content size="sm">
        <AlertDialog.Title>Stop Flint?</AlertDialog.Title>
        <AlertDialog.Description>
          Flint will disconnect its Bridges and close the desktop application. Host applications stay open.
        </AlertDialog.Description>
        <AlertDialog.Actions>
          <AlertDialog.Cancel>
            <Button variant="secondary">Cancel</Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="destructive">Stop backend</Button>
          </AlertDialog.Action>
        </AlertDialog.Actions>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
