import { PipelineStatusCards } from "./components/PipelineStatusCards";
import { CronSchedulePanel } from "./components/CronSchedulePanel";
import { SkillsPanel } from "./components/SkillsPanel";
import { ModelRoutingPanel } from "./components/ModelRoutingPanel";
import { DailyNotesFeed } from "./components/DailyNotesFeed";
import { TaskQueueView } from "./components/TaskQueueView";

export default function MissionControl() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800 px-6 py-4 sticky top-0 bg-black/95 backdrop-blur z-10">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
              Icarus Mission Control
            </h1>
            <p className="text-xs text-zinc-500">Agents · Skills · Pipelines · Model Routing</p>
          </div>
          <div className="text-xs text-zinc-600 font-mono">
            {new Date().toISOString().split("T")[0]}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6 space-y-10">

        {/* ── Section: Pipelines ─────────────────────────────────────────── */}
        <section>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-600">
            Pipelines
          </p>
          <PipelineStatusCards />
        </section>

        {/* ── Section: Automation ────────────────────────────────────────── */}
        <section>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-600">
            Automation
          </p>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <CronSchedulePanel />
            <ModelRoutingPanel />
          </div>
        </section>

        {/* ── Section: Skills ────────────────────────────────────────────── */}
        <section>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-600">
            Skills
          </p>
          <SkillsPanel />
        </section>

        {/* ── Section: Queue & Notes ─────────────────────────────────────── */}
        <section>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-600">
            Queue &amp; Notes
          </p>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TaskQueueView />
            </div>
            <DailyNotesFeed />
          </div>
        </section>

      </main>
    </div>
  );
}
