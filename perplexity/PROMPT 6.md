You are a senior full-stack developer and UI architect.
I am building the Table Editor page — this is the MOST IMPORTANT feature of the entire MVP.

The Table Editor allows developers to create database tables, edit their structure, and manage data rows — all through a visual interface that behaves like a spreadsheet combined with a schema editor.

PAGE TITLE: "Table Editor"

OVERALL PAGE LAYOUT:

The page is divided into two sections:
- LEFT PANEL: Table List (narrow, fixed width ~220px)
- RIGHT PANEL: Table Workspace (takes up remaining width)

LEFT PANEL — TABLE LIST:

Elements:
- A "+ New Table" button at the very top (accent color, full width of the panel)
- Below: a scrollable list of all table names in this project
- Each table name is a clickable item
- Clicking a table loads it in the right workspace panel
- The currently active/selected table is highlighted

If no tables exist yet:
- Show a centered empty state message: "No tables yet. Create your first table."
- The "+ New Table" button should be prominent

RIGHT PANEL — TABLE WORKSPACE:

STATE 1: No table selected (default when no tables exist or none is clicked)
- Show a centered empty state: "Select a table from the left or create a new one."

STATE 2: A table is selected — show full table workspace

TOP TOOLBAR of the workspace:
- Current table name displayed as bold text on the left
- Visibility badge: "Public" or "Private" — clickable to toggle
- Buttons on the right:
  - "Edit Schema" button (secondary style)
  - "Insert Row" button (primary style)
  - "Drop Table" button (danger/red style, with confirmation before action)

TABLE DATA VIEW (spreadsheet style, below the toolbar):
- Column headers across the top showing column names and their data types
- Rows of data below, each row in a horizontal line
- Each row has:
  - An Edit icon (pencil) on the left — clicking opens an inline edit mode
  - A Delete icon (trash) on the right — clicking prompts confirmation then deletes the row
- Clicking a cell in a row allows inline editing of that cell value
- Empty state for rows: "No rows yet. Click Insert Row to add data."
- Pagination at the bottom: "Previous" / "Next" buttons, showing "Page 1 of 3 — 30 rows total"

SCHEMA EDITING PANEL (opens as a side drawer or bottom panel when "Edit Schema" is clicked):

Title: "Edit Schema — [table name]"

Content:
- A list of all existing columns, each row showing:
  - Column Name (editable text input)
  - Data Type (dropdown selector)
  - Primary Key toggle (checkbox or switch)
  - Not Null toggle (checkbox or switch)
  - Default Value (text input, optional)
  - Delete Column button (trash icon, red)
- A "+ Add Column" button at the bottom of the column list
- A "Save Changes" button (applies schema changes to the database)
- A "Cancel" button to discard changes

SUPPORTED COLUMN DATA TYPES (shown in the dropdown):
- ID — maps to SERIAL (auto-increment integer)
- Text — maps to TEXT
- Number — maps to INTEGER
- Decimal — maps to NUMERIC
- Boolean — maps to BOOLEAN
- Timestamp — maps to TIMESTAMPTZ
- JSON — maps to JSONB
- UUID — maps to UUID with auto-generation default

NEW TABLE CREATION FLOW (when "+ New Table" is clicked):

Opens a MODAL with:
- Title: "Create New Table"
- Input: "Table Name" — text field, required
- Visibility selector: "Public" / "Private" — radio or toggle
- Column builder section:
  - Default column pre-added: "id" of type ID (primary key, auto)
  - "+ Add Column" button to add more columns
  - Each column row: Name input + Type dropdown + Not Null toggle + Delete icon
- "Create Table" button at the bottom (disabled until table name is filled)
- "Cancel" button

After "Create Table" is clicked:
- Show a loading state
- On success: close the modal, the new table appears in the left panel, and is automatically selected in the workspace
- On error: show an error message inside the modal

IMPORTANT BEHAVIORS:
- All changes (schema edits, row inserts, row updates, row deletes) must immediately reflect in the UI after API response
- Show a success toast notification for every successful action
- Show an error toast notification for every failed action
- Confirmation dialogs are required before: dropping a table, deleting a row, deleting a column
- The table name in the URL or state should update when switching between tables
