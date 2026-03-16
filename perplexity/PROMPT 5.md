You are a senior frontend developer.
I am building the Project Overview page for a minimal BaaS MVP platform dashboard.

This page is the first thing a user sees after entering the project dashboard.
It acts as the monitoring and summary center for the entire project.

PAGE TITLE: "Project Overview"

SECTION 1 — STAT CARDS ROW (top of the page):

Display 4 stat cards in a horizontal row (responsive: 2x2 grid on mobile).

Card 1 — Project Status:
- Label: "Project Status"
- Value: "Active" shown with a green dot indicator
- If the project is suspended, show "Suspended" with a red dot

Card 2 — Total API Requests:
- Label: "Total API Requests"
- Value: a number (e.g. "1,204")
- Subtitle: "This month"

Card 3 — Storage Used:
- Label: "Storage Used"
- Value: shown in MB or GB (e.g. "48 MB")

Card 4 — Last Backup:
- Label: "Last Backup"
- Value: relative time (e.g. "2 hours ago" or "Never")

Each card:
- Has a dark card background with a subtle border
- Icon on the top left of the card
- Large bold value text
- Small label text below the value

SECTION 2 — TWO COLUMN PANELS (below the stat cards):

Left Panel — Recent Activity Log:
- Title: "Recent Activity"
- Shows the last 10 actions performed in this project
- Each entry shows: action label + timestamp
- Examples of action labels:
  "Table users created"
  "SQL query executed"
  "File profile.jpg uploaded"
  "Table orders dropped"
  "Project renamed to my-backend"
- If no activity yet: show "No activity yet" message
- Each entry has a small icon indicating the type of action

Right Panel — Migration History:
- Title: "Migration History"
- Shows the last 5 to 10 SQL migrations applied to the project
- Each entry shows: migration description, status badge (Applied / Failed / Rolled Back), timestamp
- Status badges: green for Applied, red for Failed, yellow for Rolled Back
- If no migrations: show "No migrations yet" message

SECTION 3 — DATABASE REQUEST STATS (below the two panels):

- Title: "Database Requests"
- A simple bar chart or list showing daily request counts for the last 7 days
- Example rows: "March 9 — 204 requests", "March 10 — 189 requests", etc.
- In MVP this can be a simple styled table or basic visual bar representation

SECTION 4 — ADVISOR SUGGESTIONS (bottom of the page):

- Title: "Advisor"
- The system analyzes the project state and shows smart suggestions
- Each suggestion is a card with an icon (warning ⚠ or info ℹ) and a message
- Example suggestions:
  "⚠ Table logs has no primary key defined."
  "ℹ Consider adding an index on the email column in the users table for faster queries."
  "ℹ You have 0 edge functions. Consider adding one for custom API logic."
- If no suggestions: show "Your project looks healthy. No suggestions at this time." with a green checkmark

SECTION 5 — DETECTED ISSUES:

- Title: "Detected Issues"
- Shows any system-detected problems with the project database or config
- If no issues: show "No issues detected" with a green checkmark icon
- If issues exist: show them as warning cards in red or yellow

PAGE BEHAVIOR NOTES:
- All data on this page is fetched from the backend API when the page loads
- Show skeleton loading placeholders while data is loading
- If the API call fails: show a clear error message
- The page does not auto-refresh — user can manually refresh using a refresh button
