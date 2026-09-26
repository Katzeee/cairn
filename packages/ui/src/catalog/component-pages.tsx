import { alertTones, badgeTones, buttonSizes, buttonVariants } from "@cairn/design-system-catalog";
import { useState } from "react";

import { Alert, AlertTitle } from "../components/alert.js";
import { Badge, BadgeDot } from "../components/badge.js";
import { Button } from "../components/button.js";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/card.js";
import { Checkbox } from "../components/checkbox.js";
import { Combobox } from "../components/combobox.js";
import { EmptyState } from "../components/empty-state.js";
import { Field, FieldDescription, FieldError, FieldLabel } from "../components/field.js";
import { Input } from "../components/input.js";
import { Flex, Grid } from "../components/layout.js";
import { Progress } from "../components/progress.js";
import { Radio, RadioGroup } from "../components/radio-group.js";
import { Select } from "../components/select.js";
import { Separator } from "../components/separator.js";
import { Skeleton } from "../components/skeleton.js";
import { Spinner } from "../components/spinner.js";
import { Switch } from "../components/switch.js";
import { Textarea } from "../components/textarea.js";
import { PageIntro, Specimen } from "./specimen.js";

export function ButtonsPage() {
  const [busy, setBusy] = useState(false);
  return (
    <>
      <PageIntro
        description="One action hierarchy for every surface. Hover, focus, busy, and disabled states come from the component, never from screens."
        title="Buttons"
      />
      <Specimen description="Exactly one primary action per view." title="Variants">
        {buttonVariants.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Button>
        ))}
      </Specimen>
      <Specimen title="Sizes">
        {buttonSizes.map((size) => (
          <Button key={size} size={size} variant="secondary">
            Size {size}
          </Button>
        ))}
      </Specimen>
      <Specimen description="A busy button announces itself and blocks re-entry." title="States">
        <Button
          loading={busy}
          onClick={() => {
            setBusy(true);
            window.setTimeout(() => setBusy(false), 1600);
          }}
        >
          {busy ? "Working…" : "Click to load"}
        </Button>
        <Button disabled>Disabled</Button>
        <Button loading variant="outline">
          Saving
        </Button>
      </Specimen>
    </>
  );
}

export function FormsPage() {
  return (
    <>
      <PageIntro
        description="Labels stay visible, descriptions and errors are wired to the control, and validation states come from the field."
        title="Form composition"
      />
      <Specimen className="max-w-105 flex-col flex-nowrap items-stretch gap-5" title="Text field">
        <Field>
          <FieldLabel>Workspace name</FieldLabel>
          <Input defaultValue="Personal" name="workspace" />
          <FieldDescription>Only visible on this device.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel>Vault passphrase</FieldLabel>
          <Input name="passphrase" placeholder="At least 12 characters" type="password" />
        </Field>
        <Field>
          <FieldLabel>Invalid value</FieldLabel>
          <Input aria-invalid defaultValue="not-an-identity" name="identity" />
          <FieldError>The Workspace identity is not recognized.</FieldError>
        </Field>
        <Field>
          <FieldLabel>Read-only</FieldLabel>
          <Input defaultValue="workspace_9f3ac21b" name="readonly" readOnly />
        </Field>
        <Field>
          <FieldLabel>Disabled</FieldLabel>
          <Input disabled name="disabled" placeholder="Unavailable while locked" />
        </Field>
      </Specimen>
      <Specimen className="max-w-105 flex-col flex-nowrap items-stretch" title="Textarea">
        <Field>
          <FieldLabel>Workspace description</FieldLabel>
          <Textarea name="description" placeholder="What belongs in this Workspace?" rows={4} />
          <FieldDescription>Use a multiline field for notes and other prose input.</FieldDescription>
        </Field>
      </Specimen>
      <Specimen
        className="max-w-105 flex-col flex-nowrap items-stretch gap-5"
        description="Select owns a fixed set of options."
        title="Select"
      >
        <Field>
          <FieldLabel>Theme</FieldLabel>
          <Select
            defaultValue="forest"
            name="theme"
            options={[
              { label: "Forest", value: "forest" },
              { label: "Slate", value: "slate" },
              { label: "High contrast", value: "high-contrast", disabled: true },
            ]}
          />
        </Field>
      </Specimen>
      <Specimen className="max-w-105 flex-col flex-nowrap items-stretch" title="Combobox">
        <Field>
          <FieldLabel>Move to Workspace</FieldLabel>
          <Combobox
            name="workspace-target"
            options={[
              { label: "Personal knowledge", value: "personal" },
              { label: "Field notes", value: "field-notes" },
              { label: "Research", value: "research" },
              { label: "Reading inbox", value: "reading-inbox" },
              { label: "Archive", value: "archive" },
            ]}
            placeholder="Search Workspaces…"
          />
        </Field>
      </Specimen>
      <Specimen
        className="max-w-105 flex-col flex-nowrap items-stretch gap-4"
        description="Checkboxes toggle independent options; use a Switch only for settings that apply immediately."
        title="Checkbox"
      >
        <CheckboxRow defaultChecked description="Include node references in the export." label="Export references" />
        <CheckboxRow description="Also export archived nodes." label="Include archived" />
        <CheckboxRow disabled description="Unavailable until a peer is connected." label="Export shared nodes" />
      </Specimen>
      <Specimen
        className="max-w-105 flex-col flex-nowrap items-stretch gap-4"
        description="Radios pick exactly one of a small, always-visible set."
        title="Radio group"
      >
        <RadioGroup aria-label="Workspace visibility" defaultValue="private">
          <RadioRow description="Only unlocked Actors on this device can open it." label="Private" value="private" />
          <RadioRow description="Visible to every Actor in this Home." label="Home" value="home" />
          <RadioRow description="Published to connected peers." label="Shared" value="shared" />
        </RadioGroup>
      </Specimen>
      <Specimen className="max-w-105 flex-col flex-nowrap items-stretch gap-4" title="Switch">
        <SwitchRow
          defaultChecked
          description="Keep the vault unlocked while this window stays open."
          label="Stay unlocked"
        />
        <SwitchRow description="Publish presence to peers on this network." label="Announce to peers" />
        <SwitchRow disabled description="Unavailable until a Workspace exists." label="Background sync" />
      </Specimen>
    </>
  );
}

function CheckboxRow(
  properties: Readonly<{ defaultChecked?: boolean; description: string; disabled?: boolean; label: string }>,
) {
  return (
    <Checkbox
      defaultChecked={properties.defaultChecked}
      description={properties.description}
      disabled={properties.disabled}
      label={properties.label}
    />
  );
}

function RadioRow(properties: Readonly<{ description: string; label: string; value: string }>) {
  return <Radio description={properties.description} label={properties.label} value={properties.value} />;
}

function SwitchRow(
  properties: Readonly<{ defaultChecked?: boolean; description: string; disabled?: boolean; label: string }>,
) {
  return (
    <Switch
      defaultChecked={properties.defaultChecked}
      description={properties.description}
      disabled={properties.disabled}
      label={properties.label}
    />
  );
}

export function StatusPage() {
  return (
    <>
      <PageIntro
        description="Status always carries a text label; color only reinforces it. Alerts own page-level feedback, badges own inline state."
        title="Feedback composition"
      />
      <Specimen title="Badges">
        {badgeTones.map((tone) => (
          <Badge key={tone} tone={tone}>
            <BadgeDot />
            {tone.charAt(0).toUpperCase() + tone.slice(1)}
          </Badge>
        ))}
        <p className="w-full text-body">
          The inline size rides along body text: a node tagged{" "}
          <Badge size="inline" tone="accent">
            #project
          </Badge>{" "}
          keeps its line height.
        </p>
      </Specimen>
      <Specimen className="flex-col flex-nowrap items-stretch" title="Alerts">
        {alertTones.map((tone) => (
          <Alert key={tone} tone={tone}>
            <AlertTitle>{alertCopy[tone].title}</AlertTitle>
            {alertCopy[tone].body}
          </Alert>
        ))}
      </Specimen>
      <Specimen
        description="A determinate bar reports measurable work; the spinner covers short, unmeasurable waits."
        title="Progress"
      >
        <div className="flex w-full max-w-105 flex-col gap-5">
          <Progress label="Restoring index" value={64} />
        </div>
      </Specimen>
      <Specimen title="Spinner">
        <Flex align="center" gap="4">
          <Spinner label="Loading" tone="primary" />
          <Button loading variant="secondary">
            Restoring index
          </Button>
        </Flex>
      </Specimen>
      <Specimen
        description="Skeletons hold the layout of known content while it loads; never skeleton whole pages."
        title="Skeleton"
      >
        <div className="flex w-full max-w-105 items-start gap-3">
          <Skeleton shape="circle" size="md" />
          <Flex direction="column" flexGrow="1" gap="2" minWidth="0">
            <Skeleton width="short" />
            <Skeleton size="caption" />
            <Skeleton size="caption" width="long" />
          </Flex>
        </div>
      </Specimen>
      <Specimen
        className="items-stretch"
        description="An empty state names what is missing and leads to the action that creates the first item."
        title="Empty state"
      >
        <div className="w-full max-w-120">
          <EmptyState
            action={
              <Button size="sm" variant="outline">
                Connect a peer
              </Button>
            }
            description="Peers you connect will keep this Workspace in sync."
            icon="messages-square"
            title="No peers connected"
          />
        </div>
      </Specimen>
    </>
  );
}

const alertCopy = {
  neutral: { title: "Heads up", body: "The daemon endpoint changed; peers will reconnect automatically." },
  success: { title: "Workspace created", body: "Personal is ready and its identity is registered locally." },
  warning: { title: "Stale endpoint", body: "Cairn replaced a stale daemon endpoint from a previous session." },
  destructive: {
    title: "Unable to start",
    body: "The daemon lock is held by another process. The Home stays untouched.",
  },
} as const;

export function SurfacesPage() {
  return (
    <>
      <PageIntro
        description="Cards organize content with semantic surfaces. The default surface has a border and no elevation; muted is a quieter choice within the same theme."
        title="Surface composition"
      />
      <Specimen
        className="items-stretch"
        description="Surface is the default Card variant. Both variants use color and borders rather than a drop shadow."
        title="Card variants"
      >
        <div className="w-full">
          <Grid columns={{ initial: "1", lg: "2" }} gap="4">
            <Card>
              <CardHeader>
                <CardTitle>Surface · default</CardTitle>
                <CardDescription>Everything this Home owns, kept on hardware you control.</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Two Actors, one shared Workspace index, and a vault that unlocks per session.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline">
                  Review
                </Button>
                <Button size="sm" variant="ghost">
                  Dismiss
                </Button>
              </CardFooter>
            </Card>
            <Card variant="muted">
              <CardHeader>
                <CardTitle>Muted</CardTitle>
                <CardDescription>Secondary information stays grouped without demanding attention.</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription>Use this surface for supporting context within a page.</CardDescription>
              </CardContent>
            </Card>
          </Grid>
        </div>
      </Specimen>
      <Specimen
        className="flex-col flex-nowrap items-stretch"
        description="Dense lists of cards use the compact title at a lower heading level, so the page heading outline stays intact."
        title="Compact card title"
      >
        <Card>
          <CardContent>
            <Flex align="center" gap="3" wrap="wrap">
              <Flex direction="column" flexGrow="1" gap="1" minWidth="0">
                <CardTitle as="h3" size="compact">
                  Maya 2025
                </CardTitle>
                <CardDescription>maya · PID 18244 · Python 3.11</CardDescription>
              </Flex>
              <Badge tone="success">
                <BadgeDot />
                Ready
              </Badge>
            </Flex>
          </CardContent>
        </Card>
      </Specimen>
      <Specimen className="flex-col flex-nowrap items-stretch" title="Separator">
        <p className="text-body">Overview</p>
        <Separator />
        <p className="text-body text-muted-foreground">Secondary information follows a quiet boundary.</p>
      </Specimen>
    </>
  );
}
