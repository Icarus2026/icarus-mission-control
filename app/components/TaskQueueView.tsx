"use client";

import { useEffect, useState } from "react";
import { QueueResponse, QueueTask } from "@/lib/types";

const QUEUE_API = process.env.NEXT_PUBLIC_QUEUE_API_URL;
const POLL_INTERVAL = 30_000;

function statusBadge(status: string) {
  switch (status) {
    case "pending":
      return "text-yellow-400 bg-yellow-400/10";
    case "processing":
      return "text-blue-400 bg-blue-400/10";
    case "completed":
      return "text-green-400 bg-green-400/10";
    case "failed":
      return "text-red-400 bg-red-400/10";
    default:
      return "text-zinc-400 bg-zinc-400/10";
  }
}

function formatTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TaskQueueView() {
  const [data, setData] = useState<QueueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    async function load() {
      if (!QUEUE_API) return;
      try {
        const r = await fetch(`${QUEUE_API}/agents/queue`);
        const json = await r.json();
        setData(json);
        setLastRefresh(new Date());
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const counts = data?.counts;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Task Queue
        </h2>
        <span className="text-xs text-zinc-600">
          {lastRefresh
            ? `refreshed ${lastRefresh.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`
            : ""}
        </span>
      </div>

      {counts && (
        <div className="mb-4 grid grid-cols-4 gap-3">
          {(["pending", "processing", "completed", "failed"] as const).map((s) => (
            <div
              key={s}
              className={`rounded-lg px-3 py-2 text-center ${statusBadge(s)}`}
            >
              <div className="text-lg font-bold">{counts[s] ?? 0}</div>
              <div className="text-xs capitalize opacity-70">{s}</div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        {loading ? (
          <p className="p-4 text-sm text-zinc-600">Loading...</p>
        ) : !QUEUE_API ? (
          <p className="p-4 text-sm text-zinc-600">Queue API not configured (set NEXT_PUBLIC_QUEUE_API_URL)</p>
        ) : !data?.tasks?.length ? (
          <p className="p-4 text-sm text-zinc-600">Queue is empty</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500">
                  <th className="px-4 py-2 text-left font-medium">ID</th>
                  <th className="px-4 py-2 text-left font-medium">Task</th>
                  <th className="px-4 py-2 text-left font-medium">Source</th>
                  <th className="px-4 py-2 text-left font-medium">Status</th>
                  <th className="px-4 py-2 text-left font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {data.tasks.map((task: QueueTask, i: number) => (
                  <tr
                    key={task.id}
                    className={i < data.tasks.length - 1 ? "border-b border-zinc-800/50" : ""}
                  >
                    <td className="px-4 py-2 font-mono text-zinc-500">#{task.id}</td>
                    <td className="px-4 py-2 text-zinc-200 max-w-[300px] truncate">
                      {task.content}
                    </td>
                    <td className="px-4 py-2 text-zinc-500">{task.source}</td>
                    <td className="px-4 py-2">
                      <span className={`rounded px-1.5 py-0.5 font-medium ${statusBadge(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-zinc-500">{formatTime(task.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
