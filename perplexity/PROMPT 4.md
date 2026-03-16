You are a senior frontend developer and UI architect.
I am building a developer dashboard for a BaaS MVP platform.
Help me design and build the Dashboard Shell — the main layout that wraps all dashboard pages.

THE DASHBOARD SHELL HAS THREE PARTS:
1. Topbar (always visible at the top)
2. Collapsible Sidebar (left side)
3. Main Workspace Area (right side, fills remaining space)

TOPBAR DESIGN:

Position: Fixed at the top of the screen, full width, always visible
Height: 56px to 64px
Background: dark color, slightly different from the main workspace background
Border: a very subtle bottom border to separate it from the content below

Elements inside the Topbar (left to right):
- Far left: Hamburger menu icon (☰) — clicking this toggles the sidebar open or closed
- Next to hamburger: Product logo or product name text (small, clean)
- Center or left-center: Current project name shown as a small pill/badge
- Next to project name: Project ID shown in a smaller, dimmer font or masked partially (e.g. "9F2X••••")
- Far right: A gear/settings icon that links to Project Settings page

SIDEBAR DESIGN:

Position: Fixed on the left side, below the topbar
Width when EXPANDED: 240px
Width when COLLAPSED: 0px (completely hidden, no icons shown)
Animation: smooth CSS slide transition (not abrupt)
Background: slightly lighter dark shade compared to the main workspace

Default behavior:
- On desktop (screen width > 1024px): sidebar is expanded by default
- On mobile (screen width < 1024px): sidebar is collapsed by default

Mobile overlay behavior:
- On mobile, when the sidebar opens it overlays the workspace content
- Clicking outside the sidebar on mobile closes it automatically
- A semi-transparent dark overlay appears behind the sidebar on mobile

SIDEBAR NAVIGATION ITEMS (exactly these 7 items, in this exact order):
1. Project Overview — icon: grid or home icon
2. Table Editor — icon: table or grid rows icon
3. SQL Editor — icon: terminal or code brackets icon
4. Database — icon: database cylinder icon
5. Storage — icon: folder or cloud icon
6. Edge Functions — icon: lightning bolt or function icon
7. Project Settings — icon: gear/settings icon

Each sidebar item has:
- An icon on the left
- A text label next to the icon
- Hover state: slightly lighter background
- Active state: left border in accent color + slightly highlighted background
- Clicking any item changes the main workspace content

MAIN WORKSPACE AREA DESIGN:

Position: Takes up all the remaining screen width after the sidebar
Background: main dark color (e.g. #0f0f0f or #111111)
Padding: at least 24px on all sides
Overflow: scrollable vertically

Every page inside the workspace must have:
- A page title at the very top (H1 or H2 level, white text, bold)
- A short subtitle or description below the title (optional but recommended)
- The main content below

RESPONSIVE BEHAVIOR SUMMARY:
- Desktop: sidebar expanded by default, workspace takes remaining space
- Tablet: sidebar collapsed by default, can be opened with hamburger
- Mobile: sidebar is an overlay, workspace is full width

IMPORTANT NOTES:
- The sidebar state (open/closed) should be stored in component state or localStorage so it remembers the user's preference
- The active sidebar item must always be highlighted
- Smooth transitions are required — no abrupt layout shifts
- The topbar must never disappear on scroll

Build this dashboard shell as a reusable layout component that wraps all 7 dashboard pages.
