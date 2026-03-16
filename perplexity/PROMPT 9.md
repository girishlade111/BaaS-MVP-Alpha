You are a senior frontend developer.
I am building the Storage page for a minimal BaaS MVP platform dashboard.

This page lets users upload, view, and delete files stored in their project's object storage.

PAGE TITLE: "Storage"

PAGE LAYOUT:

The page is divided into two sections:
- LEFT PANEL: Bucket list (narrow, ~220px)
- RIGHT PANEL: File list workspace (takes up remaining space)

LEFT PANEL — BUCKET LIST:

Elements:
- Title: "Buckets"
- "+ New Bucket" button at the top
- List of all buckets in this project
- Each bucket is a clickable item showing the bucket name
- Default bucket: every project gets a default bucket named "default" created automatically
- The active/selected bucket is highlighted
- Each bucket shows a small file count badge next to its name

New Bucket Creation:
- Clicking "+ New Bucket" shows a small inline input or a mini modal
- User types the bucket name and presses Enter or clicks Create
- Bucket name rules: lowercase, alphanumeric, hyphens only
- New bucket appears in the list immediately

RIGHT PANEL — FILE LIST WORKSPACE:

TOP TOOLBAR:
- Current bucket name shown as the section title
- "Upload File" button (primary/accent style, left side of toolbar)
- Search input for filtering files by name (right side of toolbar)
- Sort options: by Name, by Size, by Upload Date (a small dropdown)

FILE LIST TABLE:

Columns:
- File Name (with a small file type icon before the name)
- File Type / MIME Type (e.g. image/png, application/pdf, text/csv)
- File Size (shown in KB or MB, human-readable)
- Uploaded At (relative time, e.g. "3 days ago", with full date on hover)
- Actions column: Download icon + Delete icon

Row behavior:
- Clicking the file name opens a preview or download depending on file type
- Images show a preview in a lightbox modal
- Other files are downloaded directly
- Delete icon shows a confirmation dialog before deleting

EMPTY STATE:
- When no files exist in a bucket: show a centered message with an upload icon
- Text: "No files uploaded yet. Click Upload File to get started."

FILE UPLOAD BEHAVIOR:
- Clicking "Upload File" opens the system file picker
- After selecting a file: show an upload progress indicator (a progress bar or spinner)
- On success: the file appears at the top of the list with a success notification
- On failure: show an error notification with the reason

SUPPORTED FILE TYPES:
- All file types are accepted
- Examples: JPG, PNG, SVG, GIF, WebP, PDF, DOCX, TXT, CSV, JSON, XML, ZIP, MP4

FILE SIZE LIMIT (MVP):
- Maximum file size per upload: 50 MB
- Show an error if user tries to upload a file larger than 50 MB

BUCKET DELETE:
- A small "Delete Bucket" option appears when hovering over or right-clicking a bucket name
- Deleting a bucket deletes all files inside it permanently
- Requires a confirmation dialog: "Type the bucket name to confirm deletion"
- The default bucket cannot be deleted
