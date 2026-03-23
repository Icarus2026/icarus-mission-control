"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AgentHealth } from "@/lib/types";

function formatTime(iso: string | null) {
  if (!iso) return "never";
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function AgentHealthPanel() {
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
      .channel("agent_health")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "agent_health" },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Agent Health
      </h2>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        {agents.length === 0 ? (
          <p className="p-4 text-sm text-zinc-600">No health data yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                <th className="px-4 py-2 text-left font-medium">Agent</th>
                <th className="px-4 py-2 text-left font-medium">Last run</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-right font-medium">Errors</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, i) => {
                const isUnhealthy = (agent.consecutive_errors ?? 0) >= 2;
                return (
                  <tr
                    key={agent.id}
                    className={`${i < agents.length - 1 ? "border-b border-zinc-800/50" : ""} ${
                      isUnhealthy ? "bg-red-950/20" : ""
                    }`}
                  >
                    <td className="px-4 py-2.5 font-mono text-zinc-100">
                      {agent.cron_name}
                    </td>
                    <td className="px-4 py-2.5 text-zinc-400">
                      {formatTime(agent.last_run)}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`text-xs font-medium ${
                          agent.last_status === "completed" ||
                          agent.last_status === "ok"
                            ? "text-green-400"
                            : agent.last_status === "failed" ||
                              agent.last_status === "error"
                            ? "text-red-400"
                            : "text-zinc-400"
                        }`}
                      >
                        {agent.last_status ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span
                        className={`font-mono text-xs ${
                          isUnhealthy ? "font-bold text-red-400" : "text-zinc-500"
                        }`}
                      >
                        {agent.consecutive_errors ?? 0}
                        {isUnhealthy && " ⚠"}
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
