-- Phase 2 Schema Creation

-- Enable UUID extension if not present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tasks
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    assignee TEXT,
    priority TEXT NOT NULL,
    status TEXT NOT NULL,
    due_date TIMESTAMPTZ,
    project TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Content Items
CREATE TABLE public.content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    platform TEXT NOT NULL,
    status TEXT NOT NULL,
    scheduled_date TIMESTAMPTZ,
    project TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Documents
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    snippet TEXT,
    content TEXT,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Contacts
CREATE TABLE public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT,
    company TEXT,
    email TEXT,
    phone TEXT,
    notes TEXT,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Agents
CREATE TABLE public.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT NOT NULL,
    current_task TEXT,
    status TEXT NOT NULL,
    last_active TIMESTAMPTZ DEFAULT now()
);

-- 6. Agent Logs
CREATE TABLE public.agent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES public.agents(id),
    message TEXT NOT NULL,
    project TEXT,
    status_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Cron Jobs
CREATE TABLE public.cron_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    schedule TEXT NOT NULL,
    last_run TIMESTAMPTZ,
    next_run TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true
);

-- 8. Integrations
CREATE TABLE public.integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    last_sync TIMESTAMPTZ
);
