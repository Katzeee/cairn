import { RadioGroup } from "@cairn/ui";

export default function RadioGroupPlans() {
  return (
    <RadioGroup.Root aria-label="Plan" defaultValue="team">
      <RadioGroup.Item description="For one person and a few projects." label="Personal" value="personal" />
      <RadioGroup.Item description="Shared workspaces and reviews." label="Team" value="team" />
      <RadioGroup.Item description="Contact sales to enable." disabled label="Enterprise" value="enterprise" />
    </RadioGroup.Root>
  );
}
