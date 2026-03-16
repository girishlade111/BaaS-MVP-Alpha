You are a senior UI/UX designer and frontend developer.
I am building a minimal MVP BaaS platform. Help me design the Landing Page and Project Creation Page.

LANDING PAGE:

PURPOSE:
The landing page is the very first screen a user sees.
It must immediately communicate what the platform does and push the user toward getting started.

DESIGN STYLE:
- Full-screen dark background
- Centered content layout (vertically and horizontally centered)
- No complex navigation bar — just the product name/logo at the top left
- Minimal text — no long paragraphs

ELEMENTS ON THE LANDING PAGE (top to bottom):
1. Product Logo / Name — top left corner, small and clean
2. Hero Section (centered in screen):
   - Large bold product name or tagline (H1 level)
   - One or two short sentences describing what the platform does
   - Example tagline: "Your lightweight backend, ready in seconds."
3. Primary CTA Button — large, centered, accent color — labeled "Get Started"
4. Secondary Link below the button — smaller, plain text — labeled "Access Existing Project"
5. Optional: a very minimal feature hint row at the bottom showing 3-4 icons with labels like "Tables", "SQL Editor", "Storage", "Edge Functions"

BEHAVIOR:
- Clicking "Get Started" navigates to the Project Creation page (/new)
- Clicking "Access Existing Project" navigates to the Access Project page (/access)

PROJECT CREATION PAGE (/new):

PURPOSE:
This page collects the project name and generates the project credentials.

LAYOUT:
- Centered card on a dark full-screen background
- Clean, minimal card with good padding
- Card title: "Create a New Project"

ELEMENTS INSIDE THE CARD:
1. Input field labeled "Project Name" — placeholder: "e.g. my-app-backend"
2. Helper text below the input: "Use lowercase letters, numbers, and hyphens only."
3. "Create Project" button — full width, accent color

ON SUBMIT BEHAVIOR:
- Show a loading spinner briefly while the system generates the Project ID
- Then the card transitions to a Credentials Display Screen

CREDENTIALS DISPLAY SCREEN (same page, card content changes):
- Title: "Your Project is Ready!"
- Display: Project Name with a Copy icon
- Display: Project ID (Access Key) with a Copy icon
- A bold warning box: "Save these credentials now. Your Project ID cannot be recovered if lost."
- A large "Go to Dashboard" button at the bottom

ACCESS EXISTING PROJECT PAGE (/access):

LAYOUT:
- Same centered card layout as the creation page
- Card title: "Access Your Project"

ELEMENTS:
1. Input field labeled "Project Name"
2. Input field labeled "Project ID (Access Key)"
3. "Access Project" button — full width, accent color
4. Link at the bottom: "Don't have a project? Create one"

ON SUBMIT BEHAVIOR:
- Validate both fields are filled
- Send to backend for validation
- If valid: navigate to /dashboard/:projectId/
- If invalid: show inline error message in red: "Invalid credentials. Please check your Project Name and Project ID."

Design all three pages (landing, /new, /access) to feel consistent, clean, and minimal.
Use the same dark theme, font, spacing, and accent color across all pages.
