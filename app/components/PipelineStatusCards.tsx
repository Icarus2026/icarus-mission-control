"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PipelineRun } from "@/lib/types";
import { SERVICES, ServiceDef } from "@/lib/services-data";

function statusColor(status: string) {
  switch (status) {
    case "running":   return "text-blue-400 bg-blue-400/10 border-blue-400/30";
    case "completed": return "text-green-400 bg-green-400/10 border-green-400/30";
    case "failed":    return "text-red-400 bg-red-400/10 border-red-400/30";
    case "silent":    return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
    default:          return "text-zinc-400 bg-zinc-400/10 border-zinc-400/30";
  }
}

function StatusDot({ status }: { status: string }) {
  const pulse = status === "running";
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      {pulse && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
      )}
      <span className={`relative inline-flex h-2 w-2 rounded-full ${
        status === "running"   ? "bg-blue-400"   :
        status === "completed" ? "bg-green-400"  :
        status === "failed"    ? "bg-red-400"    :
        status === "silent"    ? "bg-yellow-500" :
        "bg-zinc-600"
      }`} />
    </span>
  );
}

function formatTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function ServiceCard({ service, run }: { service: ServiceDef; run: PipelineRun | null }) {
  const status = !service.reportsToSupabase ? "silent" : (run?.status ?? "idle");
  const lastRun = run?.completed_at ?? run?.started_at ?? null;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-mono text-sm font-semibold text-zinc-100 truncate">
            {service.label}
          </h3>
          {service.port > 0 && (
            <span className="text-xs text-zinc-600 font-mono">:{service.port}</span>
          )}
        </div>
        <span className={`shrink-0 flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${statusColor(status)}`}>
          <StatusDot status={status} />
          {status === "silent" ? "no reporter" : status}
        </span>
      </div>

      <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">
        {service.description}
      </p>

      <div className="text-xs text-zinc-500 space-y-1 border-t border-zinc-800/60 pt-2">
        <div className="flex justify-between">
          <span>Schedule</span>
          <span className="text-zinc-400">{service.schedule}</span>
        </div>
        {service.reportsToSupabase && (
          <div className="flex justify-between">
            <span>Last run</span>
            <span className="text-zinc-300">{formatTime(lastRun)}</span>
          </div>
        )}
        {run?.output_file && (
          <div className="flex items-start justify-between gap-2">
            <span className="shrink-0">Output</span>
            <span className="truncate text-right font-mono text-zinc-400 max-w-[180px]">
              {run.output_file.split("/").pop()}
            </span>
          </div>
        )}
        {!service.reportsToSupabase && (
          <p className="text-yellow-600/80 text-xs pt-0.5">
            Add supabase_reporter.py to enable live status
          </p>
        )}
      </div>
    </div>
  );
}

export function PipelineStatusCards() {
  const [runs, setRuns] = useState<Record<string, PipelineRun | null>>({});

  useEffect(() => {
    const reportingServices = SERVICES.filter((s) => s.reportsToSupabase).map((s) => s.name);

    async function load() {
      const results: Record<string, PipelineRun | null> = {};
      for (const name of reportingServices) {
        const { data } = await supabase
          .from("pipeline_runs")
          .select("*")
          .eq("pipeline_name", name)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        results[name] = data ?? null;
      }
      setRuns(results);
    }
    load();

    const channel = supabase
      .channel("pipeline_runs")
      .on("postgres_changes", { event: "*", schema: "public", table: "pipeline_runs" },
        (payload) => {
          const row = payload.new as PipelineRun;
          if (row?.pipeline_name) {
            setRuns((prev) => ({ ...prev, [row.pipeline_name]: row }));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const workers = SERVICES.filter((s) => s.group === "worker");
  const agents  = SERVICES.filter((s) => s.group === "vps-agent");

  return (
    <div className="space-y-6">
      {/* Workers */}
      <div>
        <p className="mb-3 text-xs text-zinc-600 font-medium">
          Pipeline workers — {workers.length} · live Supabase reporting
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {workers.map((s) => (
            <ServiceCard key={s.name} service={s} run={runs[s.name] ?? null} />
          ))}
        </div>
      </div>

      {/* VPS Agents */}
      <div>
        <p className="mb-3 text-xs text-zinc-600 font-medium">
          VPS Docker services — {agents.length} · reporting not yet wired
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {agents.map((s) => (
            <ServiceCard key={s.name} service={s} run={runs[s.name] ?? null} />
          ))}
        </div>
      </div>
    </div>
  );
}
