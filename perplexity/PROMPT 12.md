You are a senior UI/UX designer and design system architect.
I am building a minimal BaaS MVP platform dashboard.
Define the complete visual design system for this product.

This platform must look and feel like a professional developer tool.
Reference aesthetic: Supabase, Vercel, PlanetScale — but much simpler in scope.

THEME:

The entire application uses a DARK THEME. There is no light mode in the MVP.

COLOR PALETTE:

Background colors:
- Main background (body/workspace): #0f0f0f or #111111
- Sidebar background: #1a1a1a or #161616
- Card/panel background: #1c1c1c or #1e1e1e
- Topbar background: #141414 or #181818
- Input field background: #222222 or #252525

Text colors:
- Primary text (headings, labels): #ffffff or #f5f5f5
- Secondary text (descriptions, subtitles): #a0a0a0 or #888888
- Muted text (placeholders, hints): #555555 or #666666
- Accent text (links, active states): use the accent color

Border colors:
- Subtle borders between panels: #2a2a2a or #2e2e2e
- Card borders: #262626 or #282828
- Input focus border: accent color

Accent color (choose ONE — use throughout):
- Option A: Emerald Green — #10b981
- Option B: Teal — #14b8a6
- Option C: Electric Blue — #3b82f6
Recommendation: Go with Emerald Green #10b981 to be distinct from Supabase (which uses green) but feel developer-familiar.

Status colors:
- Success: #22c55e (green)
- Error: #ef4444 (red)
- Warning: #f59e0b (amber/yellow)
- Info: #3b82f6 (blue)

TYPOGRAPHY:

Primary font: "Inter" (sans-serif, modern, clean, developer-friendly)
Code/monospace font: "JetBrains Mono" or "Fira Code" (for SQL editor, code blocks, Project IDs)
Font sizes:
- H1 (page titles): 24px, bold
- H2 (section titles): 18px, semibold
- H3 (card titles): 16px, semibold
- Body text: 14px, regular
- Small/caption text: 12px, regular
- Code text: 13px, monospace

SPACING SYSTEM:

Use a consistent 4px base unit:
- Extra small: 4px
- Small: 8px
- Medium: 16px
- Large: 24px
- Extra large: 32px
- 2x Large: 48px

Page padding: 24px on all sides
Card padding: 20px internal padding
Gap between cards: 16px

COMPONENT STYLES:

Buttons:
- Primary button: accent color background, white text, 8px border-radius, 10px 20px padding
- Secondary button: transparent background, accent color border, accent color text
- Danger button: #ef4444 background, white text
- Disabled button: muted background, muted text, cursor not-allowed
- All buttons have a subtle hover effect (slightly darker or lighter)

Input fields:
- Background: #222222
- Border: #2e2e2e (1px solid)
- Border on focus: accent color (1px solid)
- Border-radius: 6px
- Text color: white
- Placeholder color: #555555
- Padding: 10px 14px

Cards/Panels:
- Background: #1c1c1c
- Border: 1px solid #262626
- Border-radius: 8px
- Box shadow: subtle (0 1px 3px rgba(0,0,0,0.4))

Tables (data tables, not database tables):
- Header row: slightly darker background
- Body rows: main card background
- Alternating rows: very subtle shade difference
- Row hover: slightly lighter background
- Borders: subtle 1px horizontal dividers between rows

Badges/Pills:
- Status: small pill shape, 4px border-radius, colored background with matching text
- Active: green background (subtle, not bright)
- Inactive/Private: gray background
- Public: blue or teal background

Modals:
- Centered overlay
- Background: #1c1c1c
- Border: 1px solid #2a2a2a
- Border-radius: 12px
- Backdrop: rgba(0,0,0,0.7) blur overlay
- Close button (X) in the top right corner
- Padding: 32px

Toast Notifications:
- Position: bottom-right corner of the screen
- Auto-dismiss after 4 seconds
- Success: green left border
- Error: red left border
- Info: blue left border

Sidebar items:
- Default: transparent background, #a0a0a0 text, icon + label
- Hover: #222222 background, white text
- Active: #252525 background, accent color left border (3px), white text

Loading states:
- Skeleton loaders: dark gray animated blocks that match the shape of the content
- Buttons in loading state: show a spinner replacing the button text
- Full page loading: centered spinner with a subtle label

ANIMATION & TRANSITIONS:

- Sidebar open/close: CSS transition, 0.25s ease-in-out
- Modal open/close: fade in + slight scale up, 0.2s ease
- Toast appear: slide in from bottom-right, 0.3s ease
- Button hover: 0.15s transition on background-color
- No janky or abrupt transitions anywhere

ICON LIBRARY:
Use Lucide Icons (open source, consistent, developer-friendly, works great with React)

RESPONSIVE BREAKPOINTS:
- Mobile: < 768px
- Tablet: 768px – 1024px
- Desktop: > 1024px

On mobile: sidebar is hidden by default, accessed via hamburger
On tablet: sidebar can be toggled, workspace adapts
On desktop: sidebar always visible by default, can be collapsed
