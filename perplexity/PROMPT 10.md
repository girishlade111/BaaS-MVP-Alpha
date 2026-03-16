You are a senior full-stack developer.
I am building the Edge Functions page for a minimal BaaS MVP platform dashboard.

Edge Functions allow users to write and run small server-side JavaScript code blocks from within the dashboard.

PAGE TITLE: "Edge Functions"

NOTE FOR MVP SCOPE:
Edge Functions in this MVP are basic. They can be written, saved, and manually triggered from the dashboard.
Full HTTP endpoint routing and automatic deployment are future features — not part of this MVP.

PAGE LAYOUT:

The page is divided into two panels:
- LEFT PANEL: Function list (~220px)
- RIGHT PANEL: Function editor workspace

LEFT PANEL — FUNCTION LIST:

Elements:
- Title: "Functions"
- "+ New Function" button at the top
- Scrollable list of all functions in this project
- Each function shows: function name + status badge (Active / Inactive)
- Clicking a function loads it in the right panel
- Active function highlighted in the list

RIGHT PANEL — FUNCTION EDITOR:

STATE 1: No function selected
- Centered message: "Select a function or create a new one."

STATE 2: A function is selected

TOP TOOLBAR:
- Function name shown as editable text (click to rename)
- Status toggle: Active / Inactive
- "Save Function" button (primary style)
- "Run Function" button (accent style)
- "Delete Function" button (danger/red style)

FUNCTION DETAILS SECTION:
- Function Name input (text field)
- Runtime selector dropdown (default: Node.js 18)
  Available runtimes in MVP: Node.js 18 only

CODE EDITOR SECTION:
- A large Monaco-style code editor (same as SQL Editor but for JavaScript)
- JavaScript syntax highlighting
- Line numbers
- Dark background
- Default starter code for new functions:
  "// Edge Function
  // Write your server-side logic here

  module.exports = async (context) => {
    return {
      message: 'Hello from Edge Function!'
    };
  };"

OUTPUT / RESPONSE PANEL (below the editor):

Title: "Output"
- Shows the result of the last function run
- STATE: not run yet — "Click Run Function to see output here."
- STATE: running — loading spinner with "Running function..."
- STATE: success — JSON output displayed in a formatted code block (green border)
  Example: "{ message: 'Hello from Edge Function!' }"
- STATE: error — error message displayed in red
  Example: "ReferenceError: myVariable is not defined at line 5"
- Execution time shown: "Completed in 42ms"

NEW FUNCTION CREATION FLOW:

Clicking "+ New Function" opens a small modal or inline form:
- Input: "Function Name" (required, lowercase, hyphens only)
- "Create" button
- On success: function is created with default starter code and opened in the editor

DELETE FUNCTION:
- Shows a confirmation dialog: "Are you sure you want to delete [function name]? This cannot be undone."
- Two buttons: "Cancel" and "Delete"

DESIGN NOTES:
- Keep this page simple — it is not the core feature of the MVP
- The UI should feel similar to the SQL Editor in style and layout
- Save function code automatically every 30 seconds (auto-save) OR only on manual Save button click
- For MVP: choose manual save only to keep things simple
