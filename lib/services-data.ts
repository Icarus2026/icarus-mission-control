export type ServiceGroup = "worker" | "vps-agent";

export interface ServiceDef {
  name: string;           // matches pipeline_runs.pipeline_name if reporting
  label: string;          // human display name
  group: ServiceGroup;
  port: number;
  schedule: string;
  description: string;
  reportsToSupabase: boolean;
}

export const SERVICES: ServiceDef[] = [
  // ── Pipeline workers (report to Supabase pipeline_runs) ──────────────────
  {
    name: "task-worker",
    label: "Task Worker",
    group: "worker",
    port: 8020,
    schedule: "60s poll",
    description: "Pulls tasks from queue.db, routes to Kimi K2 (research) or Sonnet (orchestration)",
    reportsToSupabase: true,
  },
  {
    name: "notes-watcher",
    label: "Notes Watcher",
    group: "worker",
    port: 0,
    schedule: "inotify / instant",
    description: "Watches Daily Notes dir, extracts tasks from bullet points, deduplicates into queue.db",
    reportsToSupabase: true,
  },
  {
    name: "ad-intelligence",
    label: "Ad Intelligence",
    group: "worker",
    port: 0,
    schedule: "Mon/Wed/Fri 06:00 UTC",
    description: "Meta Ad Library + Google Transparent Ads scrape across 14 competitors, delta reporting",
    reportsToSupabase: true,
  },

  // ── VPS Docker services (no Supabase reporter yet) ────────────────────────
  {
    name: "icarus-onboarding",
    label: "Icarus Onboarding",
    group: "vps-agent",
    port: 8001,
    schedule: "on-demand",
    description: "LangGraph + Composio + Claude — intake → project → Slack → email → approval",
    reportsToSupabase: false,
  },
  {
    name: "icarus-deck-creator",
    label: "Deck Creator",
    group: "vps-agent",
    port: 8002,
    schedule: "on-demand",
    description: "CrewAI proposal generator, Gamma theme integration",
    reportsToSupabase: false,
  },
  {
    name: "icarus-research-agent",
    label: "Research Agent",
    group: "vps-agent",
    port: 8010,
    schedule: "daily 06:00 UTC",
    description: "Competitor/Reddit/FDA monitoring, market signal detection",
    reportsToSupabase: false,
  },
  {
    name: "icarus-seo-agent",
    label: "SEO Technical Agent",
    group: "vps-agent",
    port: 8011,
    schedule: "daily 07:00 UTC",
    description: "Rank tracking via GSC, technical audits, geo/citation optimisation, schema",
    reportsToSupabase: false,
  },
  {
    name: "ai-influencer-agent",
    label: "AI Influencer",
    group: "vps-agent",
    port: 8014,
    schedule: "daily 08:00 UTC",
    description: "AI persona content production pipeline for social platforms",
    reportsToSupabase: false,
  },
  {
    name: "off-page-seo-agent",
    label: "Off-Page SEO",
    group: "vps-agent",
    port: 8017,
    schedule: "daily 09:00 UTC",
    description: "Brand mentions, HARO monitoring, PR opportunity detection",
    reportsToSupabase: false,
  },
];
