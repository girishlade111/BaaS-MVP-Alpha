# BaaS Platform - Technical Specification

## Project Overview
- **Name**: DevDB (Minimal BaaS Platform)
- **Type**: Web Application (Dashboard)
- **Core Functionality**: A developer-focused Backend-as-a-Service platform for managing databases, storage, and edge functions through a clean web interface
- **Target Users**: Developers who need quick backend environment without server setup

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database ORM**: Prisma
- **Database**: PostgreSQL
- **Styling**: CSS Modules + Custom CSS Variables
- **State Management**: React Hooks + Context
- **File Storage**: Local filesystem (configurable to S3-compatible)

## UI/UX Specification

### Color Palette
- **Background Primary**: `#0a0a0a` (near black)
- **Background Secondary**: `#111111` (card backgrounds)
- **Background Tertiary**: `#1a1a1a` (elevated elements)
- **Border**: `#2a2a2a` (subtle borders)
- **Text Primary**: `#e5e5e5` (main text)
- **Text Secondary**: `#888888` (muted text)
- **Accent Primary**: `#00d9ff` (cyan/teal - brand color)
- **Accent Hover**: `#00b8d9` (darker cyan)
- **Success**: `#22c55e` (green)
- **Error**: `#ef4444` (red)
- **Warning**: `#f59e0b` (amber)

### Typography
- **Font Family**: `"JetBrains Mono", "Fira Code", monospace` (developer aesthetic)
- **Headings**: 
  - H1: 28px, weight 600
  - H2: 22px, weight 600
  - H3: 18px, weight 500
- **Body**: 14px, weight 400
- **Small/Labels**: 12px, weight 500

### Layout Structure
- **Sidebar**: Fixed left, 240px width, contains navigation
- **Main Content**: Fluid, fills remaining space
- **Header**: Fixed top within main content, shows current section + actions
- **Content Area**: Scrollable, max-width 1400px centered

### Responsive Breakpoints
- **Desktop**: 1024px+ (full sidebar)
- **Tablet**: 768px-1023px (collapsed sidebar icons only)
- **Mobile**: <768px (hamburger menu)

### Components

#### Sidebar Navigation
- Logo/Brand at top
- Navigation items with icons:
  - Dashboard (home)
  - Database (table icon)
  - SQL Runner (terminal icon)
  - Storage (folder icon)
  - Functions (code icon)
  - Settings (gear icon)
- Active state: cyan accent left border + background tint

#### Cards
- Background: `#111111`
- Border: 1px solid `#2a2a2a`
- Border-radius: 8px
- Padding: 20px
- Hover: subtle glow effect with accent color

#### Buttons
- Primary: Cyan background, dark text
- Secondary: Transparent with border
- Danger: Red background
- Border-radius: 6px
- Padding: 10px 16px
- Hover: brightness increase + subtle scale

#### Tables
- Header: `#1a1a1a` background
- Rows: alternating `#111111` and `#0f0f0f`
- Hover: row highlight
- Border: `#2a2a2a`

#### Forms
- Input background: `#111111`
- Border: 1px solid `#2a2a2a`
- Focus: cyan border glow
- Border-radius: 6px

#### Status Badges
- Small pills with colored backgrounds
- Success: green/20% opacity, green text
- Error: red/20% opacity, red text
- Info: cyan/20% opacity, cyan text

### Animations
- Page transitions: fade in (200ms)
- Button hover: scale(1.02) + brightness
- Card hover: subtle box-shadow glow
- Loading: skeleton pulse animation
- Toast notifications: slide in from top-right

## Functionality Specification

### 1. Dashboard (Home)
- **Project Stats Cards**:
  - Total Tables count
  - Total Storage used
  - Functions deployed
  - Recent Activity count
- **Quick Actions**: Buttons to create table, run SQL, upload file
- **Recent Activity Feed**: List of recent operations with timestamps

### 2. Database Section
- **Table List View**:
  - Show all tables with name, row count, size
  - Actions: View, Edit, Delete, Export
- **Create Table Modal**:
  - Table name input
  - Column definitions (name, type, nullable, primary key, unique)
  - Supported types: String, Integer, Boolean, DateTime, JSON, Float, Text
- **Table Detail View**:
  - Schema display (columns with types)
  - Browse data (pagination, 50 rows per page)
  - Add new row form
  - Delete row functionality
- **Schema Explorer**:
  - Visual tree of all tables and relationships

### 3. SQL Query Runner
- **Query Editor**:
  - Monaco-style textarea with syntax highlighting
  - Run button
  - Clear button
- **Results Panel**:
  - Table display of results
  - Row count
  - Execution time
- **Query History**:
  - List of recent queries
  - Click to re-run

### 4. Storage Section
- **File Browser**:
  - Grid/List view toggle
  - Folder navigation
  - Upload button (drag & drop support)
- **Upload Modal**:
  - File picker
  - Progress bar
  - Optional custom filename
- **File Details**:
  - Preview (for images)
  - Download button
  - Copy URL
  - Delete button
- **Storage Stats**: Used/Total display

### 5. Edge Functions Section
- **Function List**:
  - Name, status (deployed/error), last invoked
  - Create new function button
- **Function Editor**:
  - Code editor with syntax highlighting
  - Supported runtimes: JavaScript (Node.js)
  - Save/Deploy button
  - Test invocation with JSON input
- **Function Logs**:
  - Recent invocations with timestamps
  - Success/failure status
  - Response time

### 6. Settings Section
- **Database Connection**: Show connection string (masked)
- **Environment Variables**: List and edit
- **API Keys**: Generate/revoke keys
- **Project Info**: Name, created date, region

## Data Models (Prisma Schema)

### User (optional for future)
- id, email, name, createdAt

### Table
- id, name, schema (JSON), createdAt, updatedAt

### QueryHistory
- id, query, executedAt, duration, rowsReturned

### StorageFile
- id, name, path, size, mimeType, uploadedAt

### EdgeFunction
- id, name, code, status, createdAt, updatedAt

### FunctionLog
- id, functionId, invokedAt, duration, success, response

## API Endpoints

### Database
- GET /api/tables - List all tables
- POST /api/tables - Create table
- GET /api/tables/[name] - Get table schema
- DELETE /api/tables/[name] - Delete table
- GET /api/tables/[name]/data - Get table rows
- POST /api/tables/[name]/data - Insert row
- DELETE /api/tables/[name]/data/[id] - Delete row

### SQL Runner
- POST /api/sql/execute - Execute raw SQL

### Storage
- GET /api/storage - List files
- POST /api/storage/upload - Upload file
- GET /api/storage/[id] - Get file
- DELETE /api/storage/[id] - Delete file

### Functions
- GET /api/functions - List functions
- POST /api/functions - Create function
- PUT /api/functions/[id] - Update function
- DELETE /api/functions/[id] - Delete function
- POST /api/functions/[id]/invoke - Invoke function

## Acceptance Criteria

### Visual Checkpoints
- [ ] Dark theme consistently applied across all pages
- [ ] Sidebar navigation highlights active section
- [ ] Cards have proper hover effects
- [ ] Loading states show skeleton animations
- [ ] Error states display red accent colors
- [ ] Success feedback shows green accent colors

### Functional Checkpoints
- [ ] Can create a new table with multiple columns
- [ ] Can view table data with pagination
- [ ] Can run raw SQL queries and see results
- [ ] Can upload files and see them in storage browser
- [ ] Can create and invoke edge functions
- [ ] Dashboard shows accurate stats
- [ ] All actions provide feedback (success/error/toast)

### Performance
- [ ] Page loads under 2 seconds
- [ ] Database queries execute under 500ms
- [ ] UI remains responsive during operations
