import { Breadcrumbs } from "../components/breadcrumbs.js";
import { CardDescription } from "../components/card.js";
import { Link } from "../components/link.js";
import { NavItem, NavRailItem, NavSectionLabel } from "../components/nav.js";
import { Tab, TabPanel, Tabs, TabsList } from "../components/tabs.js";
import { PageIntro, Specimen } from "./specimen.js";
import { SuggestionDemo } from "./suggestion-demo.js";

export function NavigationPage() {
  return (
    <>
      <PageIntro
        description="Navigation states carry text labels and live in the URL where possible, so views stay addressable and restorable."
        title="Navigation"
      />
      <Specimen
        className="flex-col flex-nowrap items-stretch"
        description="Tabs segment one subject into peer views; the selected tab is part of the surface state."
        title="Tabs"
      >
        <Tabs defaultValue="content">
          <TabsList aria-label="Node views">
            <Tab value="content">Content</Tab>
            <Tab value="references">References</Tab>
            <Tab value="history">History</Tab>
          </TabsList>
          <TabPanel value="content">
            <CardDescription>The node itself: its fields, children, and inline content.</CardDescription>
          </TabPanel>
          <TabPanel value="references">
            <CardDescription>Every node that links here, grouped by Workspace.</CardDescription>
          </TabPanel>
          <TabPanel value="history">
            <CardDescription>Fact-by-fact history of this node, newest first.</CardDescription>
          </TabPanel>
        </Tabs>
      </Specimen>
      <Specimen
        description="Breadcrumbs expose the node path; every ancestor is one tap from anywhere in the hierarchy."
        title="Breadcrumbs"
      >
        <Breadcrumbs
          items={[
            { href: "#/design-system/components/navigation", label: "Personal knowledge" },
            { href: "#/design-system/components/navigation", label: "Projects" },
            { href: "#/design-system/components/navigation", label: "Cairn" },
            { label: "Design system roadmap" },
          ]}
        />
      </Specimen>
      <Specimen description="Use a text link for navigation within prose or supporting actions." title="Link">
        <Link href="#/design-system/components/navigation">Read the navigation guide</Link>
      </Specimen>
      <Specimen className="flex-col flex-nowrap items-start" title="Navigation items">
        <NavSectionLabel>Workspace</NavSectionLabel>
        <nav aria-label="Example navigation" className="flex flex-wrap items-center gap-3">
          <NavItem active href="#/design-system/components/navigation" icon="house">Overview</NavItem>
          <NavItem href="#/design-system/components/navigation" icon="layers">Projects</NavItem>
          <NavRailItem active href="#/design-system/components/navigation" icon="house" label="Overview in compact rail" />
          <NavRailItem href="#/design-system/components/navigation" icon="layers" label="Projects in compact rail" />
        </nav>
      </Specimen>
      <Specimen description="The same keyboard-driven suggestion surface used by rich editors can serve any host-owned search." title="Suggestion list">
        <SuggestionDemo />
      </Specimen>
    </>
  );
}
