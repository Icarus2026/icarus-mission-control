# Task Plan: Mission Control Dashboard

We are building a centralized command center to manage the AI Agent (Mick), Icarus Digital Marketing, VERO, and Lumova Health.

## Feature List & App Structure

**Layout:** Left sidebar navigation connecting to 8 distinct views.

### 1. Dashboard (Home)
- **Key Metrics:** Active tasks, content pipeline status, upcoming events (48h), recent Mick activity.
- **Live Activity Feed:** Timestamps and status dots (green = active, yellow = pending, red = error, gray = idle).

### 2. Tasks Board
- **Layout:** Kanban Board (To Do / In Progress / Review / Done).
- **Cards:** Title, assignee (Simon or Mick), priority, due date.
- **Interactions:** Drag and drop functionality.
- **Filters/Segments:** Filter by assignee, priority. Project segmentation (Icarus Operations, VERO Launch, Lumova Health).

### 3. Content Pipeline
- **Layout:** Kanban Board (Idea / Research / Brief / Draft / Scheduled / Published).
- **Cards:** Title, platform (X, LinkedIn, Instagram, TikTok), assigned day, status.
- **Features:** Rich text editor, image attachments, calendar view toggle.

### 4. Calendar
- **Views:** Month / Week / Day toggle.
- **Contents:** Displays tasks, content, meetings, cron jobs.
- **Color Coding:** Icarus (Blue), VERO (Green), Lumova (Purple), Admin (Gray).

### 5. Memory
- **Purpose:** Searchable document library.
- **Categories:** Icarus, VERO, Lumova, Research, Archive.
- **Features:** Full-text search, filtering, sorting, click-to-expand details.

### 6. AI Team View
- **Layout:** Org chart.
- **Top Level:** Mick (orchestrator, always-on).
- **Sub-agents:** Research, Content, Development, Operations.
- **Cards:** Name, role, current task, status, last active timestamp.

### 7. CRM
- **Layout:** Contact cards.
- **Cards details:** Name, role, company, email, notes.
- **Categories:** Clients, Prospects, Partners, Suppliers.

### 8. Settings
- **Features:** Cron job manager, integration status monitoring (n8n, Supabase, Slack), agent configuration.
