export type SkillStatus = "active" | "ready" | "reference" | "tooling";

export interface Skill {
  name: string;
  description: string;
  status: SkillStatus;
  model?: string;
  trigger?: string;
  port?: number;
  tags?: string[];
}

export const SKILLS: Skill[] = [
  // ── ACTIVE — wired to crons or live VPS agents ─────────────────────────────
  {
    name: "athena",
    description: "Competitive intelligence — market scans, peptide brand scoring, CI briefs",
    status: "active",
    model: "Gemini Flash",
    trigger: "daily 09:00 UTC",
    tags: ["research", "vero"],
  },
  {
    name: "seo-technical",
    description: "Technical SEO audits, rank tracking via GSC, schema, GEO/citation optimisation",
    status: "active",
    model: "Haiku",
    trigger: "daily 07:00 UTC",
    port: 8011,
    tags: ["seo", "icarus"],
  },
  {
    name: "ai-influencer",
    description: "AI persona network — TikTok, Instagram, YouTube Shorts content pipeline",
    status: "active",
    model: "Haiku",
    trigger: "daily 08:00 UTC",
    port: 8014,
    tags: ["content", "social"],
  },
  {
    name: "last30days",
    description: "Live research engine — X/Twitter, Reddit, web search over last 30 days",
    status: "active",
    model: "xAI / Brave",
    trigger: "daily 07:00 UTC (market-intelligence.py)",
    tags: ["research", "vero", "live-data"],
  },
  {
    name: "gog",
    description: "Google Workspace CLI — Gmail, Calendar, Drive, Sheets, Docs operations",
    status: "active",
    model: "Haiku",
    trigger: "via Athena + proposal-deck scripts",
    tags: ["google", "automation"],
  },
  {
    name: "n8n-workflow-automation",
    description: "n8n workflow design with error handling, idempotency, retries, review queues",
    status: "active",
    model: "Kimi K2",
    trigger: "26 active workflows via Synta MCP",
    tags: ["n8n", "automation"],
  },

  // ── READY — built and functional, not wired to a trigger yet ───────────────
  {
    name: "seo-offpage",
    description: "Off-page SEO — unlinked mentions, backlink gaps, HARO, digital PR, link briefs",
    status: "ready",
    tags: ["seo", "vero", "icarus"],
  },
  {
    name: "scroll-stop-content",
    description: "Scroll-stop content frameworks — proven patterns for social and ad creative",
    status: "ready",
    tags: ["content", "creative"],
  },
  {
    name: "scroll-stop-builder",
    description: "Conversion-focused landing page builder with scroll-stop sections",
    status: "ready",
    tags: ["landing-pages", "vero"],
  },
  {
    name: "social-media-scheduler",
    description: "Social content calendars, platform-optimised drafting, content pillars",
    status: "ready",
    tags: ["content", "social"],
  },
  {
    name: "personal-brand",
    description: "Simon's personal brand content pipeline, LinkedIn strategy, repurposing",
    status: "ready",
    port: 8015,
    tags: ["content", "personal"],
  },
  {
    name: "meta-creative-director",
    description: "Meta ad creative strategy — awareness mapping, hooks, persona development, P.D.A.",
    status: "ready",
    tags: ["meta", "creative", "vero"],
  },
  {
    name: "meta-media-buyer",
    description: "Meta ad buying strategy, campaign architecture, attribution, CAPI troubleshooting",
    status: "ready",
    tags: ["meta", "paid-ads"],
  },
  {
    name: "proposal-deck",
    description: "Generate Icarus media decks for sales leads — email delivery, Gamma integration",
    status: "ready",
    tags: ["sales", "icarus"],
  },

  // ── REFERENCE — strategic/design docs, used on demand ─────────────────────
  {
    name: "brand-identity",
    description: "Build premium brand identities from positioning → visual identity (April Dunford)",
    status: "reference",
    tags: ["brand", "vero"],
  },
  {
    name: "competitive-intelligence",
    description: "CI domain — Scout/Analyst/Critic agent system prompts, signal monitoring cadence",
    status: "reference",
    tags: ["research", "strategy"],
  },
  {
    name: "ecommerce-no-slop",
    description: "E-commerce UX/design standards, copy standards, UI/design system",
    status: "reference",
    tags: ["design", "vero"],
  },
  {
    name: "marketing-strategy-pmm",
    description: "Product marketing — positioning, GTM, competitive battlecards, product launches",
    status: "reference",
    tags: ["strategy", "vero"],
  },
  {
    name: "agentic-workflows",
    description: "Reference architecture for LangGraph/CrewAI production pipelines, debugging",
    status: "reference",
    tags: ["architecture"],
  },
  {
    name: "scroll-stop-prompter",
    description: "Content prompting for scroll-stop sections",
    status: "reference",
    tags: ["content"],
  },
  {
    name: "flora-ai",
    description: "Creative asset generation using Flora.ai (text/image/video nodes)",
    status: "reference",
    tags: ["creative"],
  },
  {
    name: "openai-image-gen",
    description: "Batch image generation via OpenAI API with prompt sampling and HTML gallery",
    status: "reference",
    tags: ["creative"],
  },
  {
    name: "notebooklm",
    description: "NotebookLM operational playbook — source processing, content production",
    status: "reference",
    tags: ["research"],
  },
  {
    name: "learn",
    description: "YouTube/X/article extraction, content evaluation, knowledge base saving",
    status: "reference",
    tags: ["research"],
  },
  {
    name: "summarize",
    description: "General-purpose content summarisation",
    status: "reference",
    tags: ["utility"],
  },

  // ── TOOLING — developer tools and safety mechanisms ────────────────────────
  {
    name: "skill-builder",
    description: "Build and audit skill files to production quality — full create/validate/package process",
    status: "tooling",
    tags: ["dev"],
  },
  {
    name: "skill-optimizer",
    description: "Iterative skill optimisation — 100-cycle eval loop with quality gates (Athena)",
    status: "tooling",
    tags: ["dev"],
  },
  {
    name: "openclaw-fleet",
    description: "OpenClaw agent fleet operations and management",
    status: "tooling",
    tags: ["dev"],
  },
  {
    name: "antigravity",
    description: "Agent debugging playbook — BLAST framework, integrations, troubleshooting",
    status: "tooling",
    tags: ["dev"],
  },
  {
    name: "engineering-standards",
    description: "Codebase protection, CLAUDE.md templates, plan templates",
    status: "tooling",
    tags: ["dev"],
  },
  {
    name: "grill-me",
    description: "Relentless interviewer — stress-tests plans before building",
    status: "tooling",
    tags: ["dev", "planning"],
  },
  {
    name: "write-a-prd",
    description: "User interview → PRD → GitHub issue",
    status: "tooling",
    tags: ["dev", "planning"],
  },
  {
    name: "prd-to-plan",
    description: "PRD → phased implementation plan with tracer-bullet vertical slices",
    status: "tooling",
    tags: ["dev", "planning"],
  },
  {
    name: "obsidian-vault",
    description: "Search, create, manage Obsidian notes with wikilinks",
    status: "tooling",
    tags: ["notes"],
  },
  {
    name: "git-guardrails-claude-code",
    description: "Blocks dangerous git commands — push, reset --hard, clean -f, branch -D",
    status: "tooling",
    tags: ["dev", "safety"],
  },
  {
    name: "slack",
    description: "Slack actions — reactions, pins, message send/edit/delete",
    status: "tooling",
    tags: ["comms"],
  },
];

export const STATUS_LABELS: Record<SkillStatus, string> = {
  active: "Active",
  ready: "Ready",
  reference: "Reference",
  tooling: "Tooling",
};

export const STATUS_COUNTS = SKILLS.reduce(
  (acc, s) => {
    acc[s.status] = (acc[s.status] ?? 0) + 1;
    return acc;
  },
  {} as Record<SkillStatus, number>
);
