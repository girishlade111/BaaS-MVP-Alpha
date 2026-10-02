# BaaS-MVP-Alpha — Backend-as-a-Service Dashboard (MVP)

A minimal Backend-as-a-Service (BaaS) platform MVP, codenamed **DevDB**, built with Next.js (App Router). It gives developers a quick backend environment without server setup: manage projects, SQL tables, edge functions, file storage, and project credentials through a clean dark dashboard UI.

## Features

- **Projects** — create and manage backend projects; per-project auth and credentials
- **Database** — table browser with row-level CRUD via REST API
- **SQL console** — execute raw SQL against the project's SQLite database
- **Edge functions** — create, edit, invoke, and delete serverless functions
- **File storage** — upload, list, and delete stored files (local filesystem, S3-compatible configurable)
- **Dashboard stats** — overview of projects, tables, functions, and storage
- **Auth** — cookie-based login with middleware-protected dashboard routes

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Database:** SQLite via `better-sqlite3`, accessed through Prisma 5 (`@prisma/client`)
- **Remote adapter:** `@prisma/adapter-libsql` (Turso/LibSQL support)
- **Styling:** Tailwind CSS v4 (PostCSS)
- **Linting:** ESLint 9 with `eslint-config-next`

## Project structure

```
src/
  app/                 # App Router pages + API routes
    api/               # REST endpoints: projects, tables, sql, functions, storage, auth
    create|dashboard|database|functions|sql|storage|credentials|settings|login
  components/ui/       # Badge, Button, Card, Input, Modal, Table, Toast
  components/layout/   # Header, Sidebar
  contexts/            # AuthContext
  lib/                 # api client, auth, db, prisma helpers
prisma/
  schema.prisma        # data model
  dev.db               # local SQLite database
SPEC.md                # original technical specification
```

## Quick start

```bash
npm install
npm run dev        # dev server at http://localhost:3000
```

Environment: set these in `.env` before running (remote DB optional):

```bash
# Local SQLite (default)
DATABASE_URL="file:./dev.db"
# Or a Turso/LibSQL remote database
# DATABASE_URL="libsql://<your-db>.turso.io"
# DATABASE_AUTH_TOKEN="<your-auth-token>"
```

```bash
npx prisma generate      # generate Prisma client
npx prisma db push       # create tables from schema
npm run build && npm start   # production build + serve
```

## API surface

- `GET/POST /api/projects`, `GET/DELETE /api/projects/me`, `POST /api/projects/auth`
- `GET/POST /api/tables`, `GET/PUT/DELETE /api/tables/[name]`, `GET/POST/DELETE /api/tables/[name]/data`
- `POST /api/sql/execute` — run raw SQL
- `GET/POST /api/functions`, `GET/PUT/DELETE /api/functions/[id]`, `POST /api/functions/[id]/invoke`
- `GET/POST /api/storage`, `GET/DELETE /api/storage/[id]`

## Deploy notes

The app is server-rendered with API routes and a database, so it cannot be
statically exported. Deploy to a platform that supports Node.js server
functions (e.g. Netlify) with a real `DATABASE_URL` / auth token set —
do not ship the local `dev.db` to production.

---

Built by Girish Lade — https://ladestack.in
