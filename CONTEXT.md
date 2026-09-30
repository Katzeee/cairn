# Cairn

Cairn is the design system shared by a family of applications: it owns how their interfaces look and behave, while each application owns its data and domain. This glossary fixes the words used when designing Cairn and building applications with it.

## Language

### Systems and applications

**Application**:
A product built with Cairn that supplies its own data, routing, domain behavior, and platform integration.

**Host**:
The runtime that presents an application's web interface, such as Tauri, Electron, a browser, or an embedded web view.
_Avoid_: Platform, when a window's shape is meant.

**Theme**:
A complete assignment of Cairn's semantic tokens that gives an application its character.

**Counterpart**:
A component, part, or prop that an established design system ships for general use and that matches a Cairn capability.
_Avoid_: Reference app, a product that merely contains a similar element.

### Kinds of capability

**Atom**:
A visual unit without domain meaning, such as a status indicator, a count, or a separator.

**Pattern**:
A composition of several parts into one interaction, such as a banner, a wizard, or a filtered list.

**Domain view**:
An application's composition of Cairn's parts that describes its own records, such as a card for one connected application.

### Navigation

**Navigation**:
An application's set of top-level destinations, declared once and presented according to the space the shell has.
_Avoid_: Navbar, tab bar, sidebar, as names for the whole.

**Destination**:
One place the navigation leads to, with a label, usually an icon, and optionally a badge.

**Sidebar**:
The presentation of the navigation as a column docked beside the content, with group labels, header, and footer.

**Drawer**:
The presentation of the navigation above the content, opened on request, where the shell is too narrow to dock a sidebar.
_Avoid_: Overlay sidebar, hamburger menu.

**Navigation bar**:
The presentation of a few destinations as icons with labels, along the bottom edge of a compact shell or as a rail beside the content.
_Avoid_: Tab bar, bottom tabs.

**Rail**:
A navigation bar placed as a narrow column beside the content.

**Page bar**:
The row at the top of a page or pane that holds its title, back step, and actions.
_Avoid_: Navigation bar, title bar, header.

**Tabs**:
Peer views of one subject within a page, switched in place.
_Avoid_: Tab bar, for top-level destinations.

### Actions

**Action priority**:
An action's importance among its peers: primary, default, or secondary. Each component presents it in its own way, such as a page bar keeping a primary action's label or a callout emphasizing it.
_Avoid_: Placement, emphasis, variant, for this importance.

### Feedback

**Status**:
The ongoing state of a process or service, such as a connection, shown for as long as the state lasts.

**Badge**:
A label attached to content, such as a record's review state.

**Destination badge**:
A count shown on a destination, such as unread messages or connected devices.
_Avoid_: Trailing text, notification dot.

**Banner**:
The region across the top of the content, above every page, that holds callouts about conditions of the whole application, such as a lost connection.
_Avoid_: Banner for the message itself; alert bar, notification bar.

**Callout**:
A message about a condition, with the steps that resolve it, shown where the condition applies: in a view, or in the banner.
_Avoid_: Alert, notice, banner.

**Toast**:
A brief announcement that something just happened, which leaves on its own.
_Avoid_: Status, for a state the user must still see.
