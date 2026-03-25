const ROUTING = [
  { agent: "Mick (main session)", model: "Claude Sonnet 4.6", use: "All interactive work — planning, synthesis, memory, routing", color: "text-orange-400" },
  { agent: "Athena (research)", model: "Gemini Flash 2.5", use: "Multi-source web research, competitor intel, YouTube transcription, long-doc summaries", color: "text-blue-400" },
  { agent: "Task Worker (queue)", model: "Kimi K2", use: "Research tasks from daily notes queue — leaf-node execution", color: "text-purple-400" },
  { agent: "Jim (contracts)", model: "Haiku 4.5", use: "Contracts, SignWell agreements, onboarding flows", color: "text-zinc-400" },
  { agent: "Aria (influencer)", model: "Haiku 4.5", use: "AI influencer pipeline, approval flows, posting review", color: "text-pink-400" },
  { agent: "n8n workflows", model: "Kimi K2", use: "Workflow JSON generation, API integrations, structured data", color: "text-green-400" },
  { agent: "R&D Council", model: "5-model council", use: "Gemini Flash · GPT-4o Mini · Haiku · DeepSeek V3 · Grok 3 Beta via OpenRouter", color: "text-yellow-400" },
  { agent: "Cron jobs / synthesis", model: "Haiku 4.5", use: "Daily synthesis, memory consolidation, AI news monitor, market intelligence", color: "text-zinc-400" },
  { agent: "Claude Code (local)", model: "Sonnet 4.6", use: "File edits, code changes, debugging, multi-file builds — VPS edits only via Claude Code", color: "text-orange-400" },
];

export function ModelRoutingPanel() {
  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Model Routing
      </h2>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-xs text-zinc-500">
              <th className="px-4 py-2 text-left font-medium">Agent / Task</th>
              <th className="px-4 py-2 text-left font-medium">Model</th>
              <th className="px-4 py-2 text-left font-medium hidden lg:table-cell">Use case</th>
            </tr>
          </thead>
          <tbody>
            {ROUTING.map((row, i) => (
              <tr key={row.agent} className={i < ROUTING.length - 1 ? "border-b border-zinc-800/50" : ""}>
                <td className="px-4 py-2.5 font-mono text-xs text-zinc-100 whitespace-nowrap">{row.agent}</td>
                <td className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap ${row.color}`}>{row.model}</td>
                <td className="px-4 py-2.5 text-xs text-zinc-500 hidden lg:table-cell">{row.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
