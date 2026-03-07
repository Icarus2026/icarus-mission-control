import { supabase } from "./supabase";

const tomorrow = new Date(Date.now() + 86400000).toISOString();
const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString();
const today = new Date().toISOString();

export async function seedDatabase() {
  console.log("Starting Supabase seed...");

  try {
    const dummyId = "00000000-0000-0000-0000-000000000000";

    console.log("Clearing existing data...");
    await supabase.from("agent_logs").delete().neq("id", dummyId);
    await supabase.from("agents").delete().neq("id", dummyId);
    await supabase.from("tasks").delete().neq("id", dummyId);
    await supabase.from("content_items").delete().neq("id", dummyId);
    await supabase.from("documents").delete().neq("id", dummyId);
    await supabase.from("contacts").delete().neq("id", dummyId);
    await supabase.from("cron_jobs").delete().neq("id", dummyId);
    await supabase.from("integrations").delete().neq("id", dummyId);

    console.log("Inserting Tasks...");
    const tasksData = [
      {
        title: "Analyze VERO competitor backlink profiles for Q3 SEO push",
        project: "VERO Launch",
        priority: "High",
        assignee: "Mick",
        status: "To Do",
        due_date: tomorrow,
      },
      {
        title: "Review Icarus Q2 ad spend ROI and optimize PMax campaigns",
        project: "Icarus Operations",
        priority: "High",
        assignee: "Simon",
        status: "To Do",
        due_date: null,
      },
      {
        title:
          "Draft landing page copy for Lumova Health preventative screening guide",
        project: "Lumova Health",
        priority: "Medium",
        assignee: "Mick",
        status: "To Do",
        due_date: nextWeek,
      },
      {
        title:
          "Develop automated creative brief generator (Firecrawl integration)",
        project: "Icarus Operations",
        priority: "High",
        assignee: "Mick",
        status: "In Progress",
        due_date: tomorrow,
      },
      {
        title: "Finalize VERO brand identity guidelines and color palette",
        project: "VERO Launch",
        priority: "Medium",
        assignee: "Simon",
        status: "In Progress",
        due_date: null,
      },
      {
        title: "Lumova Health content strategy presentation for founders",
        project: "Lumova Health",
        priority: "High",
        assignee: "Simon",
        status: "Review",
        due_date: today,
      },
      {
        title: "Set up Vite + React scaffolding for Mission Control Dashboard",
        project: "Icarus Operations",
        priority: "High",
        assignee: "Mick",
        status: "Done",
        due_date: today,
      },
      {
        title: "Audit Q1 Lumova patient acquisition cost",
        project: "Lumova Health",
        priority: "High",
        assignee: "Simon",
        status: "To Do",
        due_date: nextWeek,
      },
      {
        title: "Plan VERO influencer outreach campaign",
        project: "VERO Launch",
        priority: "Medium",
        assignee: "Mick",
        status: "To Do",
        due_date: nextWeek,
      },
      {
        title: "Review new analytics dashboard requirements",
        project: "Icarus Operations",
        priority: "Low",
        assignee: "Simon",
        status: "Review",
        due_date: nextWeek,
      },
    ];
    await supabase.from("tasks").insert(tasksData);

    console.log("Inserting Content Items...");
    const contentData = [
      {
        title:
          "The AI ROI: Why your agency needs an automated agent orchestrator",
        platform: "LinkedIn",
        status: "Idea",
        project: "Icarus Operations",
      },
      {
        title: "BPC-157 deep dive – recovery protocols and half-life explained",
        platform: "Instagram",
        status: "Idea",
        project: "VERO Launch",
      },
      {
        title: "Case study context: How we scaled a med-spa clinic using PMax",
        platform: "X",
        status: "Research",
        project: "Icarus Operations",
      },
      {
        title:
          "Video Script: The 3 supplements every founder needs for cognitive endurance",
        platform: "TikTok",
        status: "Brief",
        project: "Lumova Health",
        scheduled_date: nextWeek,
      },
      {
        title:
          "Carousel: Peptides vs Traditional TRT - The shift in optimizing men's health",
        platform: "Instagram",
        status: "Draft",
        project: "VERO Launch",
      },
      {
        title:
          'The "Invisible" AI workflow saving us 40 hours a week in client reporting',
        platform: "LinkedIn",
        status: "Draft",
        project: "Icarus Operations",
      },
      {
        title:
          "Thread: 5 Landing Page mistakes costing your brand conversions in Q4",
        platform: "X",
        status: "Scheduled",
        project: "Icarus Operations",
        scheduled_date: tomorrow,
      },
      {
        title: "Just launched our new longevity protocol stack @LumovaHealth",
        platform: "X",
        status: "Published",
        project: "Lumova Health",
        scheduled_date: today,
      },
      {
        title: "Behind the scenes: Automating lead gen workflows",
        platform: "Instagram",
        status: "Scheduled",
        project: "Icarus Operations",
        scheduled_date: tomorrow,
      },
      {
        title: "Why preventative screening is the new 401k",
        platform: "LinkedIn",
        status: "Draft",
        project: "Lumova Health",
      },
      {
        title: "How TB-500 accelerated my rotator cuff recovery",
        platform: "TikTok",
        status: "Research",
        project: "VERO Launch",
      },
    ];
    await supabase.from("content_items").insert(contentData);

    console.log("Inserting Documents...");
    const documentsData = [
      {
        title: "Q2 2026 Ad Spend Analysis & PMax Strategy",
        category: "Icarus",
        snippet:
          "Comprehensive review of Icarus Operations ad spend across Meta and Google ecosystems.",
        content: `<h2>Executive Summary</h2><p>In Q2, total ad spend reached $42,500 with an overall ROAS of 3.8x.</p>`,
      },
      {
        title: "BPC-157 & TB-500 Product Launch Protocol",
        category: "VERO",
        snippet: "Launch strategy for the new recovery peptide stack.",
        content: `<h2>Product Positioning</h2><p>Positioning BPC-157 and TB-500 for recovery.</p>`,
      },
      {
        title: "Preventative Screening Guide",
        category: "Lumova",
        snippet:
          "Updated landing page copy for the top-of-funnel preventative screening lead magnet.",
        content: `<h2>Hero Section</h2><p><strong>Headline:</strong> Catch it before it counts.</p>`,
      },
      {
        title: "LLM Orchestration Patterns 2026",
        category: "Research",
        snippet:
          "Research notes on emerging paradigms in multi-agent orchestration.",
        content: `<h2>GraphRAG Implementation Notes</h2>`,
      },
      {
        title: "2024 End of Year Review",
        category: "Archive",
        snippet: "Historical archive of the 2024 company retrospective.",
        content: `<h2>The Major Pivot</h2><p>2024 marked the complete transition to an AI-augmented agency.</p>`,
      },
      {
        title: "Lumova Patient Onboarding Flow",
        category: "Lumova",
        snippet: "Step-by-step SOP for onboarding new concierge patients.",
        content: `<h2>Step 1: Intake</h2><p>Automated Typeform sends data to CRM.</p>`,
      },
    ];
    await supabase.from("documents").insert(documentsData);

    console.log("Inserting Contacts...");
    const contactsData = [
      {
        name: "Dr. Aris Thorne",
        role: "Founder & CEO",
        company: "Vanguard Longevity",
        email: "aris@vanguardlongevity.com",
        phone: "+1 (415) 555-0198",
        category: "Clients",
        notes: "Running PMax and Meta campaigns.",
      },
      {
        name: "Sarah Jenkins",
        role: "CMO",
        company: "Apex Supplements",
        email: "sarah.j@apexsupps.com",
        phone: "+1 (310) 555-0244",
        category: "Clients",
        notes: "Primary point of contact for Apex.",
      },
      {
        name: "Marcus Vane",
        role: "CEO",
        company: "Primal Athletics",
        email: "marcus@primalathletics.co",
        phone: "+1 (512) 555-0811",
        category: "Prospects",
        notes: "Met at the BioTech summit.",
      },
      {
        name: "Dr. Elena Rostova",
        role: "Lead Researcher",
        company: "Biolab Inc. Europe",
        email: "e.rostova@biolab.eu",
        phone: "+44 20 7946 0958",
        category: "Partners",
        notes: "Lumova Health research partner.",
      },
      {
        name: "Chen Wei",
        role: "Head of QA",
        company: "SinoPeptides Manufacturing",
        email: "c.wei@sinopeptides.cn",
        phone: "+86 10 1234 5678",
        category: "Suppliers",
        notes: "Primary raw material supplier for VERO.",
      },
      {
        name: "James Holden",
        role: "Logistics Director",
        company: "Global Cold Chain",
        email: "j.holden@globalcold.com",
        phone: "+1 (312) 555-0192",
        category: "Suppliers",
        notes: "Handles cold-chain shipping logistics.",
      },
      {
        name: "Julia Vasquez",
        role: "VP Marketing",
        company: "NeuroTech Inc.",
        email: "julia@neurotech.com",
        phone: "+1 (212) 555-0987",
        category: "Prospects",
        notes: "Discussed AI agent deployments for Q1 2027.",
      },
      {
        name: "David Kim",
        role: "Engineering Lead",
        company: "DataSync Solutions",
        email: "dkim@datasync.io",
        phone: "+1 (650) 555-0342",
        category: "Partners",
        notes: "Collaborating on the API bridging for HubSpot.",
      },
    ];
    await supabase.from("contacts").insert(contactsData);

    console.log("Inserting Agents...");
    const agentsData = [
      {
        name: "Mick",
        role: "Master Orchestrator",
        department: "Orchestrator",
        current_task: "Monitoring global task limits and allocating compute.",
        status: "Online",
      },
      {
        name: "Athena",
        role: "Data Miner",
        department: "Research",
        current_task: "Scraping competitor SEO backlinks for VERO Launch.",
        status: "Busy",
      },
      {
        name: "Apollo",
        role: "Trend Analyst",
        department: "Research",
        current_task: "Pending new search parameters.",
        status: "Idle",
      },
      {
        name: "Calliope",
        role: "Copywriter",
        department: "Content",
        current_task: "Drafting LinkedIn carousel for Icarus Operations.",
        status: "Busy",
      },
      {
        name: "Hermes",
        role: "Social Dist",
        department: "Content",
        current_task: "Queuing approved VERO drafts to Buffer API.",
        status: "Online",
      },
      {
        name: "Hephaestus",
        role: "Code Gen",
        department: "Development",
        current_task: "Awaiting Next.js component specifications.",
        status: "Idle",
      },
      {
        name: "Argus",
        role: "QA/Testing",
        department: "Development",
        current_task: "Running end-to-end Cypress tests on Lumova staging.",
        status: "Busy",
      },
      {
        name: "Janus",
        role: "CRM Sync",
        department: "Operations",
        current_task: "Syncing recent lead form submissions to HubSpot.",
        status: "Online",
      },
    ];
    await supabase.from("agents").insert(agentsData);
    const { data: insertedAgents } = await supabase.from("agents").select();

    console.log("Inserting Agent Logs...");
    if (insertedAgents && insertedAgents.length > 0) {
      const mickId =
        insertedAgents.find((a) => a.name === "Mick")?.id ||
        insertedAgents[0].id;
      const athenaId =
        insertedAgents.find((a) => a.name === "Athena")?.id ||
        insertedAgents[0].id;
      const calliopeId =
        insertedAgents.find((a) => a.name === "Calliope")?.id ||
        insertedAgents[0].id;

      const logsData = [
        {
          agent_id: mickId,
          message:
            "Mick completed weekly PMax campaign analysis for VERO Launch.",
          project: "VERO",
          status_type: "active",
        },
        {
          agent_id: calliopeId,
          message:
            "Drafting landing page copy for Lumova Health preventative screening guide.",
          project: "Lumova",
          status_type: "pending",
        },
        {
          agent_id: mickId,
          message:
            "Failed to sync latest CRM contacts from Hubspot API. Retrying in 15m.",
          project: "Icarus",
          status_type: "error",
        },
        {
          agent_id: mickId,
          message:
            "System cron: Nightly database backup completed successfully.",
          project: "Mick",
          status_type: "idle",
        },
        {
          agent_id: mickId,
          message:
            "Published LinkedIn carousel: 'The AI ROI for Marketing Agencies'.",
          project: "Icarus",
          status_type: "active",
        },
        {
          agent_id: athenaId,
          message:
            "Initiated SEO backlink scrape for 'peptide therapy' keywords.",
          project: "VERO",
          status_type: "active",
        },
        {
          agent_id: athenaId,
          message:
            "Scrape complete. Found 450 referring domains. Classifying intent.",
          project: "VERO",
          status_type: "active",
        },
        {
          agent_id: calliopeId,
          message: "Awaiting approval for LinkedIn carousel wireframe.",
          project: "Icarus",
          status_type: "pending",
        },
        {
          agent_id: mickId,
          message:
            "Allocated 3 additional compute nodes to Development environment.",
          project: "Icarus",
          status_type: "idle",
        },
        {
          agent_id: mickId,
          message:
            "API limit reached on Firecrawl scraper. Paused operations for 1 hour.",
          project: "Icarus",
          status_type: "error",
        },
        {
          agent_id: mickId,
          message: "Resumed Firecrawl operations successfully.",
          project: "Icarus",
          status_type: "active",
        },
        {
          agent_id: calliopeId,
          message: "Vero influencer outreach templates generated.",
          project: "VERO",
          status_type: "active",
        },
      ];
      await supabase.from("agent_logs").insert(logsData);
    }

    console.log("Inserting Cron Jobs...");
    const cronData = [
      {
        name: "Competitor Brand Keyword Scan",
        schedule: "0 8 * * *",
        is_active: true,
      },
      {
        name: "Content Pipeline HubSpot Sync",
        schedule: "*/15 * * * *",
        is_active: true,
      },
      {
        name: "Lumova Health Lead Form Ingestion",
        schedule: "0 * * * *",
        is_active: true,
      },
      {
        name: "System Database Backup",
        schedule: "0 0 * * 0",
        is_active: false,
      },
      {
        name: "Weekly Analytics Report Gen",
        schedule: "0 9 * * 1",
        is_active: true,
      },
      {
        name: "Daily Agent compute cleanup",
        schedule: "0 2 * * *",
        is_active: true,
      },
    ];
    await supabase.from("cron_jobs").insert(cronData);

    console.log("Inserting Integrations...");
    const integrationsData = [
      { name: "n8n Webhooks", status: "Connected" },
      { name: "Supabase Vector", status: "Connected" },
      { name: "Slack Bot (Mick)", status: "Connected" },
      { name: "Telegram Alerts", status: "Disconnected" },
      { name: "Anthropic Claude 3.5 API", status: "Connected" },
      { name: "Firecrawl Scraper", status: "Connected" },
      { name: "HubSpot CRM", status: "Connected" },
      { name: "Meta Ads API", status: "Disconnected" },
    ];
    await supabase.from("integrations").insert(integrationsData);

    console.log("Seed process finished successfully!");
    return { success: true };
  } catch (err) {
    console.error("Error during seed:", err);
    return { success: false, error: err };
  }
}
