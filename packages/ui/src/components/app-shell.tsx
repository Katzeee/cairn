import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { useState, type CSSProperties, type ReactNode } from "react";

import { IconButton } from "./button.js";
import { Icon, type IconName } from "./icon.js";
import { NavItem, NavRailItem, NavSectionLabel } from "./nav.js";
import { usePortalContainer } from "./internal/portal-container.js";
import { Separator } from "./separator.js";
import { Tooltip } from "./tooltip.js";

export type AppShellItem = Readonly<{
  icon?: IconName;
  decoration?: ReactNode;
  id: string;
  label: string;
  target: string;
}>;

export type AppShellSection = Readonly<{
  id: string;
  items: readonly AppShellItem[];
  label?: string;
}>;

export type AppShellUtility = Readonly<{
  icon: IconName;
  id: string;
  label: string;
  onSelect?: () => void;
  target?: string;
}>;

type AppShellProperties = Readonly<{
  activeItemId: string;
  navigation?: (close: () => void) => ReactNode;
  brand?: string;
  children: ReactNode;
  sections: readonly AppShellSection[];
  utilities?: readonly AppShellUtility[];
}>;

export function AppShell({
  activeItemId,
  brand = "Cairn",
  children,
  sections,
  navigation,
  utilities = [],
}: AppShellProperties) {
  const railAvailable =
    navigation === undefined &&
    sections.some((section) => section.items.length > 0) &&
    sections.every((section) => section.items.every((item) => item.icon !== undefined || item.decoration != null));
  // A bottom bar only carries a handful of unlabeled, equally ranked
  // destinations; richer navigation graphs get a top bar with a modal drawer.
  const soleSection = sections.length === 1 ? sections[0] : undefined;
  const barItems = soleSection?.label === undefined ? soleSection?.items : undefined;
  const usesBar = railAvailable && barItems !== undefined && barItems.length <= 5 && utilities.length === 0;
  // People may prefer the icon rail even where the container affords the full
  // sidebar; the preference never overrides what narrow containers mandate.
  const [railPreferred, setRailPreferred] = useState(false);
  return (
    <div className="cairn-AppShell" data-ui="app-shell">
      {usesBar ? null : (
        <CompactDrawerBar
          activeItemId={activeItemId}
          brand={brand}
          sections={sections}
          utilities={utilities}
          navigation={navigation}
          railAvailable={railAvailable}
        />
      )}

      <div className="cairn-AppShellBody">
        {railAvailable ? (
          <MediumRail
            activeItemId={activeItemId}
            brand={brand}
            onExpand={() => setRailPreferred(false)}
            railPreferred={railPreferred}
            sections={sections}
            utilities={utilities}
          />
        ) : null}
        <ExpandedSidebar
          activeItemId={activeItemId}
          brand={brand}
          navigation={navigation}
          onCollapse={railAvailable ? () => setRailPreferred(true) : undefined}
          railPreferred={railAvailable && railPreferred}
          sections={sections}
          utilities={utilities}
        />
        <div className="cairn-AppShellContent">{children}</div>
      </div>

      {usesBar ? <CompactBottomBar activeItemId={activeItemId} items={barItems} /> : null}
    </div>
  );
}

type TierProperties = Readonly<{
  navigation?: (close: () => void) => ReactNode;
  activeItemId: string;
  brand: string;
  sections: readonly AppShellSection[];
  utilities: readonly AppShellUtility[];
}>;

function CompactBottomBar({ activeItemId, items }: Readonly<{ activeItemId: string; items: readonly AppShellItem[] }>) {
  return (
    <nav
      aria-label="Primary"
      className="cairn-AppShellBottomBar"
      data-layout="compact"
      style={{ "--app-shell-items": items.length } as CSSProperties}
    >
      {items.map((item) => (
        <a
          aria-current={item.id === activeItemId ? "page" : undefined}
          className="cairn-AppShellBottomItem cairn-Focusable"
          href={item.target}
          key={item.id}
        >
          {item.decoration ?? (item.icon === undefined ? null : <Icon name={item.icon} size="sm" />)}
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

function CompactDrawerBar({
  activeItemId, brand, sections, utilities, navigation, railAvailable,
}: TierProperties & Readonly<{ railAvailable: boolean }>) {
  const [open, setOpen] = useState(false);
  const { anchorRef, container } = usePortalContainer();
  return (
    <header className="cairn-AppShellCompactHeader" data-layout="compact" data-rail={railAvailable}>
      <BaseDialog.Root onOpenChange={setOpen} open={open}>
        <BaseDialog.Trigger render={<IconButton aria-label="Open navigation" variant="ghost" />}>
          <Icon name="menu" />
        </BaseDialog.Trigger>
        <span hidden ref={anchorRef} />
        <BaseDialog.Portal container={container}>
          <BaseDialog.Backdrop className="cairn-DialogBackdrop" />
          <BaseDialog.Popup aria-label={`${brand} navigation`} className="cairn-AppShellDrawer">
            <span className="cairn-AppShellDrawerClose">
              <BaseDialog.Close render={<IconButton aria-label="Close navigation" variant="ghost" />}>
                <Icon name="x" />
              </BaseDialog.Close>
            </span>
            <span className="cairn-AppShellBrand">
              <BrandMark label={brand} />
              <span className="cairn-AppShellBrandText">{brand}</span>
            </span>
            <SectionedNav
              activeItemId={activeItemId}
              navigation={navigation}
              onNavigate={() => setOpen(false)}
              sections={sections}
              utilities={utilities}
            />
          </BaseDialog.Popup>
        </BaseDialog.Portal>
      </BaseDialog.Root>
      <span className="cairn-AppShellBrand">
        <span className="cairn-AppShellBrandText">{brand}</span>
      </span>
    </header>
  );
}

function MediumRail({
  activeItemId,
  brand,
  onExpand,
  railPreferred,
  sections,
  utilities,
}: TierProperties & Readonly<{ onExpand: () => void; railPreferred: boolean }>) {
  return (
    <aside className="cairn-AppShellRail" data-layout="medium" data-preferred={railPreferred}>
      <BrandMark label={brand} />
      <span className="cairn-AppShellExpand">
        <Tooltip content="Expand navigation" side="right">
          <IconButton aria-label="Expand navigation" onClick={onExpand} variant="ghost">
            <Icon name="panel-left-open" />
          </IconButton>
        </Tooltip>
      </span>
      <nav aria-label="Primary" className="cairn-AppShellRailNav">
        {sections.map((section, index) => (
          <div
            aria-label={section.label}
            className="cairn-AppShellRailGroup"
            key={section.id}
            role={section.label === undefined ? undefined : "group"}
          >
            {index === 0 ? null : (
              <div className="cairn-AppShellRailSeparator">
                <Separator />
              </div>
            )}
            {section.items.map((item) => (
              <NavRailItem
                active={item.id === activeItemId}
                href={item.target}
                icon={item.icon}
                decoration={item.decoration}
                key={item.id}
                label={item.label}
              />
            ))}
          </div>
        ))}
      </nav>
      {utilities.length === 0 ? null : (
        <div className="cairn-AppShellRailUtilities">
          {utilities.map((utility) =>
            utility.target === undefined ? (
              <Tooltip content={utility.label} key={utility.id}>
                <IconButton aria-label={utility.label} onClick={utility.onSelect} variant="ghost">
                  <Icon name={utility.icon} />
                </IconButton>
              </Tooltip>
            ) : (
              <NavRailItem href={utility.target} icon={utility.icon} key={utility.id} label={utility.label} />
            ),
          )}
        </div>
      )}
    </aside>
  );
}

function ExpandedSidebar({
  activeItemId,
  brand,
  onCollapse,
  navigation,
  railPreferred,
  sections,
  utilities,
}: TierProperties & Readonly<{ onCollapse?: () => void; railPreferred: boolean }>) {
  return (
    <aside className="cairn-AppShellSidebar" data-layout="expanded" data-preferred={railPreferred}>
      <div className="cairn-AppShellSidebarHeader">
        <a className="cairn-AppShellBrand" href="#/">
          <BrandMark label={brand} />
          <span className="cairn-AppShellBrandText">{brand}</span>
        </a>
        {onCollapse === undefined ? null : (
          <Tooltip content="Collapse navigation">
            <IconButton aria-label="Collapse navigation" onClick={onCollapse} size="sm" variant="ghost">
              <Icon name="panel-left-close" size="sm" />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <SectionedNav activeItemId={activeItemId} sections={sections} utilities={utilities} navigation={navigation} />
    </aside>
  );
}

function SectionedNav({
  navigation,
  activeItemId,
  onNavigate,
  sections,
  utilities,
}: Readonly<{
  activeItemId: string;
  navigation?: (close: () => void) => ReactNode;
  onNavigate?: () => void;
  sections: readonly AppShellSection[];
  utilities: readonly AppShellUtility[];
}>) {
  return (
    <>
      <nav aria-label="Primary" className="cairn-AppShellSectionedNav">
        {navigation
          ? navigation(onNavigate ?? (() => {}))
          : sections.map((section) => (
              <div key={section.id}>
                {section.label === undefined ? null : <NavSectionLabel>{section.label}</NavSectionLabel>}
                <div className="cairn-AppShellNavItems">
                  {section.items.map((item) => (
                    <NavItem
                      active={item.id === activeItemId}
                      href={item.target}
                      icon={item.icon}
                      decoration={item.decoration}
                      key={item.id}
                      onClick={onNavigate}
                    >
                      {item.label}
                    </NavItem>
                  ))}
                </div>
              </div>
            ))}
      </nav>
      {utilities.length === 0 ? null : (
        <div className="cairn-AppShellUtilities">
          {utilities.map((utility) =>
            utility.target === undefined ? (
              <button
                className="cairn-NavItem cairn-Focusable cairn-AppShellUtilityButton"
                key={utility.id}
                onClick={() => {
                  utility.onSelect?.();
                  onNavigate?.();
                }}
                type="button"
              >
                <Icon name={utility.icon} size="sm" />
                {utility.label}
              </button>
            ) : (
              <NavItem href={utility.target} icon={utility.icon} key={utility.id} onClick={onNavigate}>
                {utility.label}
              </NavItem>
            ),
          )}
        </div>
      )}
    </>
  );
}

function BrandMark({ label }: Readonly<{ label: string }>) {
  return (
    <span aria-label={label} className="cairn-AppShellBrandMark" role="img">
      {label.trim().charAt(0).toUpperCase()}
    </span>
  );
}
