You are a senior frontend developer.
I am building the SQL Editor page for a minimal BaaS MVP platform dashboard.

The SQL Editor allows developers to write and execute raw SQL commands directly against their project's database.

PAGE TITLE: "SQL Editor"

PAGE LAYOUT:

The page is split into two vertical sections:
- TOP SECTION: SQL input area (approximately 40-50% of the page height)
- BOTTOM SECTION: Results/output panel (approximately 50-60% of the page height)

TOP SECTION — SQL INPUT AREA:

Elements:
- A large code editor component that looks and behaves like VS Code / Monaco Editor
- SQL syntax highlighting (keywords like SELECT, FROM, WHERE, CREATE, etc. highlighted in different colors)
- Line numbers on the left side of the editor
- Auto-indentation
- The editor area has a dark background with light-colored text

Top bar of the editor:
- Left: label text "SQL Editor"
- Right side buttons:
  - "Clear" button (secondary style) — clears the editor content
  - "Run Query" button (primary/accent style) — executes the current SQL

Keyboard shortcut:
- Ctrl+Enter or Cmd+Enter should also run the query (shown as a hint near the Run button)

BOTTOM SECTION — RESULTS PANEL:

This panel shows the output of the last executed query.

STATE 1 — Default (no query run yet):
- Show a centered message: "Run a query to see results here."

STATE 2 — Query is running:
- Show a loading spinner with text: "Executing query..."

STATE 3 — Query returned data (SELECT query):
- Show a clean data table with:
  - Column headers in the first row (bold)
  - Data rows below
  - Alternating row background for readability
  - Horizontal scrolling if there are many columns
- Below the table: "Returned X rows in Xms" (e.g. "Returned 5 rows in 14ms")

STATE 4 — Query was a DDL or DML command (CREATE, INSERT, UPDATE, DELETE, ALTER, DROP):
- Show a green success message box: "Query executed successfully."
- If the command affected rows: "X rows affected."
- Show execution time

STATE 5 — Query failed or had an error:
- Show a red error message box
- Display the exact database error message inside the box
- Example: "ERROR: column 'emal' does not exist. Did you mean 'email'?"

QUERY HISTORY PANEL (side panel or collapsible section):

- Title: "Query History"
- Shows the last 10 queries run in this session
- Each item shows: first 60 characters of the query + timestamp
- Clicking a history item loads that query back into the editor
- A "Clear History" button at the bottom

SAFETY NOTICES VISIBLE IN UI:
- A small info bar below the editor: "Queries run only within your project schema. System tables are not accessible."
- A timeout notice: "Queries are automatically cancelled after 10 seconds."

RESIZABLE PANELS (optional for MVP):
- A drag handle between the editor and results panel so users can resize both sections
- If not building resizable panels: use a fixed 50/50 or 40/60 split

EDITOR PLACEHOLDER TEXT:
When the editor is empty, show placeholder text:
"-- Write your SQL here
SELECT * FROM your_table;"
