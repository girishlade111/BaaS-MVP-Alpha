You are a senior full-stack developer and UI/UX architect.

I am building a minimal MVP Backend-as-a-Service (BaaS) platform called [PRODUCT NAME].

This is NOT a Supabase clone. This is a simple, clean, developer-focused MVP.

Your job is to help me design, build, and document this platform based on the full context provided below.

Read everything carefully before responding. This is the single source of truth for this product.

=============================================================
SECTION 1 — PRODUCT OVERVIEW
=============================================================

This platform is a lightweight developer tool that allows developers to:
- Create and manage database tables through a visual dashboard
- Run raw SQL queries
- Explore their database schema
- Upload and manage files
- Write and run edge functions
- Monitor project activity and usage

The platform is project-based. There are NO user accounts, NO email login, NO OAuth.
Access to any project is controlled purely by a PROJECT NAME and PROJECT ID (Access Key) pair.

The platform is designed to feel like a professional developer tool — similar in aesthetic to Supabase, Vercel, and PlanetScale — but much simpler in scope.

=============================================================
SECTION 2 — PROJECT ACCESS SYSTEM (IDENTITY MODEL)
=============================================================

The platform does not have traditional user authentication.
Instead, every project has its own access credentials.

HOW IT WORKS:

Step 1 — User opens the landing page.
Step 2 — User clicks "Get Started".
Step 3 — User is taken to the Project Creation page.
Step 4 — User enters a Project Name.
Step 5 — The system automatically generates a unique Project ID (8-character alphanumeric string, e.g. "9F2XK8A3").
Step 6 — The system displays both credentials to the user. The user must save them.
Step 7 — The project dashboard opens automatically after creation.

TO ACCESS AN EXISTING PROJECT:

The user must provide:
- Project Name
- Project ID (Access Key)

Both must match exactly. If either is wrong, access is denied.

IMPORTANT RULES:
- The Project ID can never be changed or regenerated once created.
- The Project Name can be renamed later from Project Settings.
- If credentials are lost, the project becomes permanently inaccessible.
- These credentials are shown once at creation — the user is clearly warned to save them.
- There is no password recovery, no email verification, no secondary access method.

Example credentials:
Project Name: my-app-backend
Project ID (Access Key): 9F2XK8A3

=============================================================
SECTION 3 — LANDING PAGE
=============================================================

The landing page is the first screen the user sees.

It is a simple, minimal, dark-themed page.

ELEMENTS ON LANDING PAGE:
- Product name / logo at the top
- A short one-line or two-line description of what the platform does
- A large "Get Started" button in the center
- A secondary "Access Existing Project" option below the Get Started button
- Clean, full-screen layout — no complex navigation

BEHAVIOR:
- Clicking "Get Started" opens the Project Creation page
- Clicking "Access Existing Project" opens a form asking for Project Name and Project ID

=============================================================
SECTION 4 — PROJECT CREATION PAGE
=============================================================

This page appears when a user clicks "Get Started".

ELEMENTS:
- A text input field labeled "Project Name"
- A "Create Project" button
- On submit, the system generates a Project ID automatically
- A credentials display screen appears showing:
  - Project Name
  - Project ID (Access Key)
  - A clear warning: "Save these credentials. You cannot recover them later."
  - A "Copy" button for each credential
  - A "Go to Dashboard" button

BEHAVIOR:
- The user cannot proceed to the dashboard without seeing this credentials screen
- After clicking "Go to Dashboard", the project workspace opens
- The credentials are stored in the browser's sessionStorage for the current session

=============================================================
SECTION 5 — ACCESS EXISTING PROJECT PAGE
=============================================================

This page allows users to re-enter their project from any device.

ELEMENTS:
- Input field: "Project Name"
- Input field: "Project ID (Access Key)"
- "Access Project" button

BEHAVIOR:
- The system validates both fields against the database
- If valid — user enters the project dashboard
- If invalid — an error message is shown: "Invalid credentials. Please check your Project Name and Project ID."
- Credentials are stored in sessionStorage after successful access

=============================================================
SECTION 6 — PROJECT DASHBOARD LAYOUT
=============================================================

The dashboard is the main workspace of the platform.
It is a single-page application that changes content based on sidebar selection.

OVERALL LAYOUT STRUCTURE:

The screen is divided into three parts:
1. Top Navigation Bar (always visible)
2. Collapsible Sidebar (left side)
3. Main Workspace Area (right side, takes up most of the screen)

TOP NAVIGATION BAR:
- Hamburger menu icon (☰) on the far left — toggles the sidebar open/closed
- Product logo or name next to the hamburger icon
- Current project name displayed in the center or left area
- Project ID displayed next to the project name (partially masked or visible)
- Settings icon or avatar on the far right

SIDEBAR:
- Opens and closes smoothly using the hamburger menu toggle
- Default state: expanded on desktop, collapsed on mobile
- Width when expanded: approximately 240px
- Width when collapsed: 0px (completely hidden) with a smooth CSS slide animation
- The sidebar has a dark background, slightly different shade from the main workspace
- Active sidebar item is highlighted with a left-border accent and slightly different background

SIDEBAR NAVIGATION ITEMS (in order from top to bottom):
1. Project Overview
2. Table Editor
3. SQL Editor
4. Database
5. Storage
6. Edge Functions
7. Project Settings

These are the only seven items. No extra items, no sub-menus in the MVP.

MAIN WORKSPACE AREA:
- Takes up the full remaining width after the sidebar
- Has a dark background
- Content changes based on which sidebar item is selected
- Each section has a page title at the top
- Clean, spacious layout with good padding

=============================================================
SECTION 7 — PROJECT OVERVIEW PAGE
=============================================================

This is the first page users see after entering the dashboard.
It acts as the monitoring and summary center for the project.

INFORMATION DISPLAYED:

Stat Cards Row (top of the page):
- Project Status (Active / Suspended)
- Total API Requests (number)
- Storage Used (in MB or GB)
- Last Backup Time (relative time, e.g. "2 hours ago")

Below Stat Cards:

Left Panel — Recent Activity Log:
- Shows a list of recent actions performed in this project
- Examples: "Table users created", "SQL query executed", "File uploaded"
- Each entry shows: action name, timestamp

Right Panel — Migration History:
- Shows recent SQL migrations applied to the project database
- Each entry shows: migration description, status (applied / failed), timestamp

Bottom Section — Advisor Suggestions:
- The system analyzes the project and shows simple recommendations
- Examples: "Table orders has no primary key", "Consider adding an index on the email column"
- These appear as info or warning cards with an icon

Bottom Section — Detected Issues:
- Any system-detected problems are shown here
- If no issues, a clean "No issues detected" message appears

=============================================================
SECTION 8 — TABLE EDITOR PAGE
=============================================================

The Table Editor is the CORE FEATURE of this MVP.
It is the most important and most used section of the platform.

PURPOSE:
Users can create new database tables, edit their structure, and manage data rows — all through a visual spreadsheet-style interface.

LEFT PANEL (Table List):
- A list of all tables in this project's database
- Each table name is clickable
- A "+ New Table" button at the top of the list
- Clicking a table loads it in the main editor area

MAIN EDITOR AREA (when a table is selected):

Top Toolbar:
- Current table name displayed
- "Edit Schema" button — opens the column/schema editing panel
- "Insert Row" button — adds a new empty row
- "Drop Table" button — permanently deletes the table (with confirmation)
- Table visibility toggle: Public / Private

Table View (Spreadsheet-Style):
- Columns displayed as headers
- Rows displayed below as editable cells
- Each row has an edit icon and a delete icon
- Click a cell to edit its value inline
- Pagination at the bottom if there are many rows

SCHEMA EDITING PANEL (when "Edit Schema" is clicked):
- Shows all columns with their settings
- Each column shows: Column Name, Data Type, Primary Key toggle, Not Null toggle, Default Value
- A "+ Add Column" button at the bottom
- A "Save Changes" button

SUPPORTED COLUMN DATA TYPES (for the UI type selector):
- ID (auto-increment integer)
- Text
- Number (integer)
- Decimal
- Boolean
- Timestamp
- JSON
- UUID

TABLE CREATION FLOW (when "+ New Table" is clicked):
- A modal or side panel opens
- User enters: Table Name
- User adds columns one by one (name + type)
- User sets visibility: Public or Private
- User clicks "Create Table"
- Table is created and appears in the table list

=============================================================
SECTION 9 — SQL EDITOR PAGE
=============================================================

This page allows users to write and run raw SQL commands directly against their project database.

LAYOUT:

Top Section — SQL Input Area:
- A large code editor input area (Monaco Editor style — VS Code look)
- Syntax highlighting for SQL
- "Run Query" button on the top right of the editor
- "Clear" button to clear the editor

Bottom Section — Results Panel:
- If the query returns data: a table showing the result rows with column headers
- If the query is a DDL command (CREATE, ALTER, DROP): a success message shown
- If there is an error: a red error message box showing the database error
- Query execution time shown (e.g. "Returned 5 rows in 14ms")

Side Panel (optional for MVP) — Query History:
- A list of recent queries run in this session
- Clicking a query loads it back into the editor

SAFETY RULES (backend enforced, but visible in UX):
- Queries run only against the current project's database schema
- System tables and other project schemas are not accessible
- A query timeout of 10 seconds is enforced

=============================================================
SECTION 10 — DATABASE PAGE
=============================================================

This page is a read-only explorer of the project's full database structure.

ELEMENTS:

Left Panel — Table List:
- All tables in the project listed
- Clicking a table loads its details on the right

Right Panel — Table Details:
- Table name
- List of all columns with: name, data type, constraints (primary key, not null, unique)
- Indexes on the table
- Row count

Bottom Section — Relationships View (basic for MVP):
- Shows if any foreign key relationships exist between tables
- Displayed as a simple text list: "Table A.column references Table B.column"

PURPOSE:
This page is for exploration and understanding the current state of the database — not for editing.

=============================================================
SECTION 11 — STORAGE PAGE
=============================================================

This page allows users to upload and manage files for their project.

ELEMENTS:

Top Toolbar:
- "Upload File" button
- Bucket selector (a bucket is like a folder — default bucket exists per project)
- "Create New Bucket" button

File List Area:
- A table listing all uploaded files
- Columns: File Name, File Size, MIME Type / File Type, Upload Date
- Each row has a "Download" icon and a "Delete" icon

File Upload Behavior:
- User clicks "Upload File"
- A file picker opens
- User selects a file
- File is uploaded to the project's storage bucket
- File appears in the list immediately after upload

Supported file types (all types accepted in MVP):
- Images (JPG, PNG, SVG, GIF, WebP)
- Documents (PDF, DOCX, TXT)
- Data files (CSV, JSON, XML)
- Any other binary file

=============================================================
SECTION 12 — EDGE FUNCTIONS PAGE
=============================================================

This section allows users to write and run small server-side logic scripts.

PURPOSE:
Edge functions are lightweight server-side code blocks that can:
- Act as simple API endpoints
- Run background tasks
- Perform data transformations

ELEMENTS:

Left Panel — Function List:
- All edge functions for this project listed
- "+ New Function" button

Right Panel — Function Editor:
- Function Name input
- Code editor area (Monaco Editor style)
- Runtime selector (default: Node.js)
- "Save Function" button
- "Run Function" button
- Output / Response panel showing result of the function when run

NOTE FOR MVP:
Edge Functions is a basic feature in the MVP. Full deployment and HTTP endpoint routing can be expanded in later versions. In the MVP, functions can be saved and manually triggered from within the dashboard.

=============================================================
SECTION 13 — PROJECT SETTINGS PAGE
=============================================================

This is the configuration and management page for the current project.

SECTIONS ON THIS PAGE:

1. Project Identity:
   - Project Name (editable text field with a "Rename" button)
   - Project ID / Access Key (read-only, with a "Copy" icon)

2. Organization:
   - Shows current organization if the project belongs to one
   - "Create Organization" button if no org exists
   - "Attach to Organization" button if an org exists but this project is not in it

3. Project Usage Statistics:
   - Total DB Requests this month
   - Storage Used (MB/GB)
   - Number of active tables
   - Number of edge functions
   - Number of files stored

4. Danger Zone:
   - "Delete Project" button styled in red
   - Clicking it shows a confirmation modal
   - The user must type the exact Project Name to confirm deletion
   - Deleting removes: all tables, all data, all files, all functions, all activity logs, all settings

=============================================================
SECTION 14 — ORGANIZATION SYSTEM
=============================================================

Users can optionally create an organization to group multiple projects together.

WHAT AN ORGANIZATION CONTAINS:
- Organization Name
- Multiple projects

IMPORTANT:
- An organization does NOT have its own access credentials
- Each project inside an org still requires its own Project Name + Project ID to access
- Organizations are only used for logical grouping in the UI
- A project can exist without belonging to any organization
- A project can be moved into an organization at any time from Project Settings

CREATING AN ORGANIZATION:
- User goes to Project Settings
- Clicks "Create Organization"
- Enters an organization name
- Organization is created
- The current project can be attached to it immediately

=============================================================
SECTION 15 — UI DESIGN GUIDELINES
=============================================================

The visual design of this platform must follow developer tool design patterns.

OVERALL AESTHETIC:
- Dark theme throughout the entire application
- Background color: very dark gray or near-black (e.g. #0f0f0f or #111111)
- Sidebar background: slightly lighter dark shade (e.g. #1a1a1a or #161616)
- Text: white and light gray
- Accent color: a single brand color (green, teal, or blue — to be decided)
- Font: monospace or modern sans-serif developer font

SIDEBAR DESIGN:
- Dark background
- Sidebar items: icon + text label side by side
- Active item: left border in accent color + slightly highlighted background
- Smooth open/close animation (CSS transition, not abrupt)
- On mobile: sidebar overlays the workspace and closes when clicking outside

MAIN WORKSPACE DESIGN:
- Clean, generous padding (at least 24px on all sides)
- Page title at the top of every section (H1-level heading)
- Content organized in clear cards or panels with subtle borders or shadows
- Tables are styled cleanly — alternating row colors or hover highlights
- Buttons follow a consistent style: primary (accent color), secondary (outlined), danger (red)

TOPBAR DESIGN:
- Fixed at the top, always visible even when scrolling
- Height: approximately 56–64px
- Hamburger menu icon on the far left
- Product logo text next to it
- Center or left: project name pill/badge
- Right side: settings/gear icon

MODAL DESIGN:
- Centered overlay with dark background blur
- Clean white-on-dark modal card
- A close button (X) in the top right
- Used for: new table creation, delete confirmation, credentials display

=============================================================
SECTION 16 — PAGE ROUTES (URL STRUCTURE)
=============================================================

/ → Landing page
/new → Project creation page
/access → Access existing project page
/dashboard/:projectId/ → Project Overview
/dashboard/:projectId/tables → Table Editor
/dashboard/:projectId/sql → SQL Editor
/dashboard/:projectId/database → Database Explorer
/dashboard/:projectId/storage → Storage
/dashboard/:projectId/functions → Edge Functions
/dashboard/:projectId/settings → Project Settings

=============================================================
SECTION 17 — SESSION MANAGEMENT
=============================================================

There are no server-side sessions, cookies, or JWT tokens in this MVP.

HOW SESSION WORKS:
- When a user successfully creates or accesses a project, the credentials (Project Name + Project ID) are stored in the browser's sessionStorage
- Every dashboard API request reads these from sessionStorage and sends them as HTTP headers
- If sessionStorage is cleared (browser closes or tab closes), the user must re-enter credentials via the Access Project page
- There is no "stay logged in" or "remember me" feature in the MVP

=============================================================
SECTION 18 — WHAT IS OUT OF SCOPE FOR THIS MVP
=============================================================

The following features are explicitly NOT part of this MVP:
- Email/password login or registration
- OAuth (Google, GitHub, etc.)
- JWT-based authentication
- User profiles or user settings
- Team collaboration or shared access to projects
- Role-based access control (RBAC)
- Real-time subscriptions or websockets
- Email notifications
- Billing or subscription management
- API key generation for external app integration
- CLI tool
- Mobile app
- Multi-region database support
- Backups and restore (beyond showing "last backup time" on overview)
- Database branching or version control
- Custom domains

=============================================================
SECTION 19 — DEVELOPMENT PRIORITIES
=============================================================

Build order for this MVP (most important to least important):

Priority 1 — Core Foundation:
- Landing page
- Project creation flow with credential generation
- Access existing project flow
- Dashboard shell (layout: topbar + sidebar + workspace area)

Priority 2 — Core Feature:
- Table Editor (this is the #1 feature of the MVP)
- SQL Editor

Priority 3 — Supporting Features:
- Project Overview dashboard
- Database Explorer page
- Project Settings page (including delete)

Priority 4 — Additional Features:
- Storage page
- Edge Functions page
- Organization system

=============================================================
SECTION 20 — TONE AND STYLE FOR THIS PRODUCT
=============================================================

The product should feel:
- Professional but minimal
- Fast and responsive
- Developer-first (not for non-technical users)
- No marketing fluff inside the dashboard
- Errors should be clear and technical (not hidden)
- Every action should have clear feedback (success messages, error messages, loading states)
- The product must feel trustworthy — especially because there is no traditional account system

=============================================================
END OF CONTEXT
=============================================================

Now, based on all the context above, you are ready to help me build this MVP.

When I give you a task, always refer back to this context document.
Do not add features that are not mentioned here.
Do not suggest switching to a more complex architecture unless I ask.
Keep all suggestions minimal, practical, and aligned with the MVP scope defined above.
