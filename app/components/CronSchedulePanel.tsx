"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AgentHealth } from "@/lib/types";

// Static schedule metadata — maps cron_name → human schedule + next-run info
const SCHEDULES: Record<string, { expr: string; label: string; tz: string }> = {
  "daily-synthesis":             { expr: "55 7 * * *",  label: "07:55 daily",        tz: "Dublin" },
  "R&D Council AM":              { expr: "0 8 * * *",   label: "08:00 daily",        tz: "Dublin" },
  "Market Intelligence":         { expr: "0 7 * * *",   label: "07:00 daily",        tz: "Dublin" },
  "Grok Market Intelligence":    { expr: "0 7 * * *",   label: "07:00 daily",        tz: "Dublin" },
  "Athena Daily Research":       { expr: "0 9 * * *",   label: "09:00 daily",        tz: "UTC" },
  "R&D Council PM":              { expr: "0 18 * * *",  label: "18:00 daily",        tz: "Dublin" },
  "AI News & Advances Monitor":  { expr: "0 8 * * *",   label: "08:00 daily",        tz: "UTC" },
  "Daily Note Creator":          { expr: "0 7 * * *",   label: "07:00 daily",        tz: "Dublin" },
  "Commitments Audit":           { expr: "0 7,10,13 * * *", label: "3× daily",       tz: "Dublin" },
  "Memory Capture":              { expr: "0 */3 * * *", label: "every 3h",           tz: "UTC" },
  "Daily Memory Consolidation":  { expr: "0 23 * * *",  label: "23:00 daily",        tz: "UTC" },
  "Daily Session Journal":       { expr: "0 22 * * *",  label: "22:00 daily",        tz: "Dublin" },
  "Restricted Brand Ad Monitor": { expr: "0 6 * * *",   label: "06:00 daily",        tz: "UTC" },
  "Weekly Memory Maintenance":   { expr: "0 7 * * 0",   label: "Sunday 07:00",       tz: "UTC" },
  "Workspace Backup":            { expr: "0 3 * * *",   label: "03:00 daily",        tz: "UTC" },
};

function formatTime(iso: string | null) {
  if (!iso) return "never";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function CronSchedulePanel() {
  const [agents, setAgents] = useState<AgentHealth[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("agent_health")
        .select("*")
        .order("last_run", { ascending: false });
      setAgents(data ?? []);
    }
    load();
    const channel = supabase
      .channel("cron_schedule")
      .on("postgres_changes", { event: "*", schema: "public", table: "agent_health" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const healthy = agents.filter((a) => (a.consecutive_errors ?? 0) === 0).length;
  const unhealthy = agents.filter((a) => (a.consecutive_errors ?? 0) >= 2).length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Cron Schedule
        </h2>
        <div className="flex gap-3 text-xs">
          <span className="text-green-400">{healthy} healthy</span>
          {unhealthy > 0 && <span className="text-red-400">{unhealthy} failing</span>}
          <span className="text-zinc-600">{agents.length} total</span>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        {agents.length === 0 ? (
          <p className="p-4 text-sm text-zinc-600">No cron data yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                <th className="px-4 py-2 text-left font-medium">Job</th>
                <th className="px-4 py-2 text-left font-medium hidden md:table-cell">Schedule</th>
                <th className="px-4 py-2 text-left font-medium">Last run</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-right font-medium">Errors</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, i) => {
                const isUnhealthy = (agent.consecutive_errors ?? 0) >= 2;
                const sched = SCHEDULES[agent.cron_name];
                const isOk = agent.last_status === "completed" || agent.last_status === "ok";
                const isFail = agent.last_status === "failed" || agent.last_status === "error";
                return (
                  <tr
                    key={agent.id}
                    className={`${i < agents.length - 1 ? "border-b border-zinc-800/50" : ""} ${
                      isUnhealthy ? "bg-red-950/20" : ""
                    }`}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                          isUnhealthy ? "bg-red-500" : isOk ? "bg-green-500" : "bg-zinc-600"
                        }`} />
                        <span className="font-mono text-xs text-zinc-100">{agent.cron_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 hidden md:table-cell">
                      {sched ? (
                        <span className="text-xs text-zinc-400">
                          {sched.label}{" "}
                          <span className="text-zinc-600">{sched.tz}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-700">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-zinc-400">
                      {formatTime(agent.last_run)}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs font-medium ${
                        isOk ? "text-green-400" : isFail ? "text-red-400" : "text-zinc-500"
                      }`}>
                        {agent.last_status ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`font-mono text-xs ${
                        isUnhealthy ? "font-bold text-red-400" : "text-zinc-600"
                      }`}>
                        {agent.consecutive_errors ?? 0}{isUnhealthy && " ⚠"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
