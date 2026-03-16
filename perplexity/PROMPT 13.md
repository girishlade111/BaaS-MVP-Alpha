You are a senior full-stack developer.
I am building a minimal BaaS MVP platform. This prompt defines page routes, session management, and what is explicitly out of scope for this MVP.

PAGE ROUTES (URL STRUCTURE):

/ → Landing page
/new → Project creation page (Create New Project flow)
/access → Access existing project page (Enter credentials flow)
/dashboard/:projectId/ → Project Overview (default dashboard page)
/dashboard/:projectId/tables → Table Editor
/dashboard/:projectId/sql → SQL Editor
/dashboard/:projectId/database → Database Explorer
/dashboard/:projectId/storage → Storage
/dashboard/:projectId/functions → Edge Functions
/dashboard/:projectId/settings → Project Settings

ROUTE PROTECTION:
- All /dashboard/:projectId/* routes must check sessionStorage for valid credentials before rendering
- If credentials are missing from sessionStorage: redirect to /access
- If credentials exist but are invalid (checked on first API call): clear sessionStorage and redirect to /access
- The landing page (/), /new, and /access routes are always accessible without credentials

URL PARAMETER:
- :projectId in the URL is the Project ID (e.g. "9F2XK8A3")
- This is used to identify which project's data to load
- Combined with the project name from sessionStorage for backend validation

SESSION MANAGEMENT:

After successful project creation or access:
- Store in browser sessionStorage:
  - Key: "project_id" → Value: "9F2XK8A3"
  - Key: "project_name" → Value: "my-app-backend"

Every API request from the dashboard must include these HTTP headers:
  x-project-id: 9F2XK8A3
  x-project-name: my-app-backend

When browser tab is closed: sessionStorage is automatically cleared (this is default browser behavior)
There is no persistent login — the user must re-enter credentials each new browser session
There is no "Remember Me" feature in the MVP

NAVIGATING BETWEEN PAGES:
- The active sidebar item always matches the current URL path
- Browser back/forward navigation should work correctly
- If a user directly types a dashboard URL without credentials: redirect to /access

WHAT IS EXPLICITLY OUT OF SCOPE FOR THIS MVP:
(Do NOT build, suggest, or design any of the following)

Authentication & Accounts:
- Email/password login or registration
- OAuth (Google, GitHub, Discord, etc.)
- JWT tokens or refresh tokens
- User profiles, avatars, or account settings
- Multi-user collaboration on a single project
- Team member invites or shared access
- Role-based access control (RBAC)
- Permission levels (admin, viewer, editor)

Advanced Features:
- Real-time data subscriptions or WebSockets
- Push notifications or email notifications
- Billing, subscription management, or usage limits
- API key generation for external application integration
- CLI tool or SDK
- Mobile application
- Multi-region database support or geo-routing
- Database branching or version control (like PlanetScale branching)
- Automated backups and point-in-time restore
- Custom domain support for edge functions
- Webhook system
- Audit logs with user attribution (only basic activity logs)

Design & UX:
- Light mode or theme switcher
- Internationalization (i18n) or multi-language support
- Accessibility features beyond basic semantic HTML
- Onboarding tutorial or interactive walkthrough

Infrastructure:
- Kubernetes or container orchestration
- Multi-tenant database with separate database instances per project
- CDN configuration
- SSL certificate management
- Server-side monitoring or alerting system

DEVELOPMENT BUILD PRIORITIES:

Build in this exact order:

PRIORITY 1 — Foundation (build this first, nothing else works without it):
- Landing page
- Project creation flow with credential generation
- Access existing project flow
- Dashboard shell (topbar + collapsible sidebar + workspace area)
- Backend: project creation API, project access validation API, middleware

PRIORITY 2 — Core Feature (this is the main value of the MVP):
- Table Editor (table list, schema editor, row CRUD, new table modal)
- SQL Editor (code editor, query execution, results display)
- Backend: all table routes, all row routes, SQL execution route

PRIORITY 3 — Supporting Pages:
- Project Overview dashboard (stat cards, activity log, advisor)
- Database Explorer page
- Project Settings page (rename, delete, usage stats)
- Backend: activity log, stats API, project rename, project delete

PRIORITY 4 — Additional Features (build last):
- Storage page (file upload, file list, bucket management)
- Edge Functions page (function editor, run function)
- Organization system (create org, attach project)
- Backend: storage integration, edge function execution, org routes

Always build in this priority order. Do not start Priority 2 until Priority 1 is complete.
