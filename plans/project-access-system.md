# BaaS Platform - Project-Based Access System Implementation Plan

## Overview

This document outlines the implementation plan for adding project-based authentication to the BaaS platform MVP. Each project will have its own credentials (Project Name + Project ID) with full data isolation.

## System Architecture

### Credential Flow
```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Landing   │────▶│   Create     │────▶│  Credentials    │
│   Page      │     │   Project    │     │  Screen         │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                  │
                                                  ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Dashboard  │◀────│   Auth       │◀────│  sessionStorage │
│  (Protected) │     │   Check      │     │                 │
└──────┬──────┘     └──────────────┘     └─────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│              All API Requests Include:                      │
│  - X-Project-ID: 8-character alphanumeric                   │
│  - X-Project-Name: User-defined project name                │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema Changes

#### New Project Model
```prisma
model Project {
  id          String   @id @default(uuid())
  name        String   // User-defined project name (can be renamed)
  projectId   String   @unique // 8-char alphanumeric, generated once
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations - all data isolated per project
  tables       Table[]
  storageFiles StorageFile[]
  functions    EdgeFunction[]
  queryHistory QueryHistory[]
}
```

#### Updated Existing Models (add projectId relation)
- `Table` - belongs to Project
- `StorageFile` - belongs to Project  
- `EdgeFunction` - belongs to Project
- `QueryHistory` - belongs to Project

### API Routes Structure

#### New Routes
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/projects` | Create new project |
| POST | `/api/projects/auth` | Authenticate with credentials |
| GET | `/api/projects/me` | Get current project info |

#### Protected Routes (require auth)
| Method | Path | Purpose |
|--------|------|---------|
| GET/POST | `/api/tables/*` | Table operations |
| GET/POST | `/api/storage/*` | Storage operations |
| GET/POST | `/api/functions/*` | Function operations |
| GET/POST | `/api/sql/*` | SQL execution |
| GET | `/api/stats` | Dashboard stats |

### Frontend Pages

| Page | Purpose |
|------|---------|
| `/` (root) | Landing page with Get Started / Access Existing Project |
| `/create` | Project creation form |
| `/credentials` | Display generated credentials with warning |
| `/login` | Access existing project |
| `/dashboard` | Main dashboard (protected) |
| `/database` | Database management (protected) |
| `/storage` | File storage (protected) |
| `/functions` | Edge functions (protected) |
| `/sql` | SQL runner (protected) |
| `/settings` | Project settings (protected) |

### Security Implementation

#### Auth Middleware Logic
```typescript
// Validate on every protected API request
1. Extract X-Project-ID and X-Project-Name from headers
2. Query Project where projectId = header.projectId
3. Verify project.name === header.projectName
4. If invalid → Return 401 Unauthorized
5. If valid → Attach project to request context and proceed
```

#### Session Management
- Store in: `sessionStorage`
- Keys: `project_id`, `project_name`
- Cleared on: Browser tab close
- No server-side sessions, cookies, or tokens

## Implementation Steps

### Phase 1: Database & Backend
1. Add Project model to schema.prisma
2. Add projectId foreign key to existing models
3. Run Prisma migration
4. Create auth middleware utility
5. Create project API routes
6. Update all existing API routes to use auth middleware

### Phase 2: Frontend - Auth Flow
1. Create landing page (replace current dashboard)
2. Create project creation page
3. Create credentials display page
4. Create login/access page

### Phase 3: Frontend - Integration
1. Update API client to add credentials to all requests
2. Add sessionStorage management hooks
3. Update dashboard layout to check auth
4. Update sidebar to show project info

### Phase 4: Testing
1. Test project creation flow
2. Test credential display and warning
3. Test login with valid credentials
4. Test login with invalid credentials
5. Test data isolation between projects
6. Test session persistence across page navigation
7. Test session cleared on tab close

## UI/UX Specifications

### Landing Page
- Hero section with platform description
- Two main CTAs: "Get Started" (create new) and "Access Existing Project"
- Clean, minimal design

### Credentials Screen (Critical)
- Large, prominent display of Project ID
- Clear warning message: "Save this Project ID now. It cannot be recovered if lost."
- Copy to clipboard button
- "Go to Dashboard" button

### Access Project Page
- Two input fields: Project Name, Project ID
- Error message: "Invalid credentials. Please check your Project Name and Project ID."

### Project ID Generation
- Format: 8-character alphanumeric (uppercase)
- Characters: A-Z, 0-9 (excluding confusing chars like 0/O, 1/I)
- Generated using crypto.randomUUID() filtered to format

## Edge Cases

1. **Lost Project ID**: No recovery - show warning clearly
2. **Duplicate Project Name**: Allowed (distinguished by Project ID)
3. **Case Sensitivity**: Project ID is case-insensitive for login, stored uppercase
4. **Empty session**: Redirect to login, not landing
5. **API requests without credentials**: Return 401
6. **Invalid credentials on API**: Return 401 with specific error
