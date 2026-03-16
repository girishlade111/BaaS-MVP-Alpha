You are a senior frontend developer.
I am building the Database Explorer page for a minimal BaaS MVP platform dashboard.

This page is a READ-ONLY explorer of the entire database structure for the current project.
Users come here to understand their database — not to edit it.

PAGE TITLE: "Database"

PAGE LAYOUT:

The page is divided into two panels:
- LEFT PANEL: Table list (narrow, ~220px wide)
- RIGHT PANEL: Table detail view (takes up remaining width)

LEFT PANEL — TABLE LIST:

Elements:
- Title: "Tables" with a count badge (e.g. "Tables (7)")
- Scrollable list of all table names in the project
- Each table name is clickable
- The currently selected table is highlighted
- No edit or create buttons here — this is explore-only
- If no tables exist: "No tables found. Create tables in the Table Editor."

RIGHT PANEL — TABLE DETAIL VIEW:

STATE 1: No table selected
- Centered message: "Select a table to explore its structure."

STATE 2: A table is selected — show full table details

TOP of the right panel:
- Table name as a large heading
- Visibility badge: "Public" or "Private"
- Row count: "X rows total"
- A "Open in Table Editor" button that navigates to the Table Editor with this table pre-selected

COLUMN STRUCTURE TABLE:

Title: "Columns"
A clean table showing all columns with these columns:
- Column Name
- Data Type
- Nullable (Yes / No)
- Default Value
- Constraints (Primary Key / Unique / Foreign Key badges)

INDEXES SECTION:

Title: "Indexes"
A table showing all indexes on this table:
- Index Name
- Column(s)
- Type (B-tree, Hash, etc.)
- Unique (Yes / No)

If no indexes beyond the primary key: "No additional indexes."

RELATIONSHIPS SECTION (basic for MVP):

Title: "Relationships"
Shows any foreign key relationships for this table:
- Each relationship shown as: "This table's [column] references [other table].[column]"
- And reverse: "Referenced by [other table].[column]"
- If no relationships: "No foreign key relationships found."

DATABASE SUMMARY PANEL (shown when NO table is selected — alternate default state):

Instead of "select a table" message, show a database summary card:
- Total Tables: X
- Total Rows across all tables: X
- Total Indexes: X
- Schema Name: proj_XXXXXXXX

DESIGN NOTES:
- This entire page is read-only — no edit, no delete, no create buttons
- All data is fetched live from the backend when the page loads or a table is selected
- Skeleton loaders while data is loading
- The page helps developers understand their current database state quickly
