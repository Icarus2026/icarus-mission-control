import { PipelineStatusCards } from "./components/PipelineStatusCards";
import { AgentHealthPanel } from "./components/AgentHealthPanel";
import { DailyNotesFeed } from "./components/DailyNotesFeed";
import { TaskQueueView } from "./components/TaskQueueView";

export default function MissionControl() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
              Icarus Mission Control
            </h1>
            <p className="text-xs text-zinc-500">Pipeline status &amp; agent health</p>
          </div>
          <div className="text-xs text-zinc-600 font-mono">
            {new Date().toISOString().split("T")[0]}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6 space-y-8">
        {/* Pipeline Status Cards */}
        <PipelineStatusCards />

        {/* Two-column: Agent Health + Daily Notes */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AgentHealthPanel />
          <DailyNotesFeed />
        </div>

        {/* Task Queue */}
        <TaskQueueView />
      </main>
    </div>
  );
}
