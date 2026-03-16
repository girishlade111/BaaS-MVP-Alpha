You are a senior full-stack developer.
I am building the Project Settings page for a minimal BaaS MVP platform dashboard.

This page is the control center for the project configuration, credentials, usage stats, and danger actions.

PAGE TITLE: "Project Settings"

THE PAGE IS DIVIDED INTO CLEARLY LABELED SECTIONS:

SECTION 1 — PROJECT IDENTITY:

Title: "Project Identity"

Elements:
- Label: "Project Name"
  - Displays current project name in an editable input field
  - A "Rename" button next to it
  - On click: saves the new name to the backend
  - Success toast: "Project name updated successfully"
  - Validation: name must be at least 3 characters, alphanumeric and hyphens only

- Label: "Project ID (Access Key)"
  - Displays the full Project ID in a read-only input field (e.g. "9F2XK8A3")
  - A copy icon next to it — clicking copies to clipboard
  - A small info note below: "This is your permanent access key. It cannot be changed."

SECTION 2 — ORGANIZATION:

Title: "Organization"

STATE A — Project does not belong to any organization:
- Text: "This project is not part of any organization."
- Two buttons:
  - "Create New Organization" — opens a modal to create an org
  - (If organizations exist in the system) "Attach to Existing Organization" — shows a selector

STATE B — Project belongs to an organization:
- Shows: Organization Name
- A "Detach from Organization" link (small, subtle)

CREATE ORGANIZATION MODAL:
- Input: "Organization Name" (required)
- "Create" button
- On success: the org is created and the current project is automatically attached to it

SECTION 3 — PROJECT USAGE STATISTICS:

Title: "Usage"

Shows a clean stats grid:
- Total DB Requests (this month): number
- Storage Used: MB / GB
- Number of Active Tables: number
- Number of Edge Functions: number
- Number of Files Stored: number
- Project Created On: date

Design: show as stat cards or a clean two-column table

SECTION 4 — DANGER ZONE:

Title: "Danger Zone"
This section has a red-tinted border or background to visually signal it is destructive.

Only one action here:
- "Delete Project" button — styled in red, full-width or large size
- Clicking opens a confirmation modal

DELETE PROJECT CONFIRMATION MODAL:
- Title: "Delete Project Permanently"
- Warning text: "This action cannot be undone. Deleting this project will permanently remove:"
  - All database tables and data
  - All uploaded files and storage
  - All edge functions
  - All activity logs and migration history
  - All project configuration and settings
- Instruction: "Type the exact project name below to confirm:"
- A text input where the user must type the project name exactly
- "Delete Project" button — only becomes active/enabled when the typed name matches the project name exactly
- "Cancel" button

After confirming deletion:
- Show a loading state
- On success: redirect to the landing page with a message: "Project [name] has been permanently deleted."

DESIGN NOTES FOR THIS PAGE:
- Each section is a separate card with clear titles and subtle borders
- The Danger Zone card has a red-tinted border to visually separate it
- All actions give immediate visual feedback (loading states, success/error toasts)
- The Project ID field should be clearly marked as permanent and non-editable
