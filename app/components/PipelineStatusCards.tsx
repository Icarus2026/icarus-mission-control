"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PipelineRun } from "@/lib/types";

const PIPELINES = ["task-worker", "notes-watcher", "ad-intelligence"];

function statusColor(status: string) {
  switch (status) {
    case "running":
      return "text-blue-400 bg-blue-400/10 border-blue-400/30";
    case "completed":
      return "text-green-400 bg-green-400/10 border-green-400/30";
    case "failed":
      return "text-red-400 bg-red-400/10 border-red-400/30";
    default:
      return "text-zinc-400 bg-zinc-400/10 border-zinc-400/30";
  }
}

function StatusDot({ status }: { status: string }) {
  const pulse = status === "running";
  return (
    <span className="relative flex h-2 w-2">
      {pulse && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
      )}
      <span
        className={`relative inline-flex h-2 w-2 rounded-full ${
          status === "running"
            ? "bg-blue-400"
            : status === "completed"
            ? "bg-green-400"
            : status === "failed"
            ? "bg-red-400"
            : "bg-zinc-500"
        }`}
      />
    </span>
  );
}

function formatTime(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PipelineCard({ name, run }: { name: string; run: PipelineRun | null }) {
  const status = run?.status ?? "idle";
  const lastRun = run?.completed_at ?? run?.started_at ?? null;
  const outputFile = run?.output_file;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm font-semibold text-zinc-100">{name}</h3>
        <span
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor(status)}`}
        >
          <StatusDot status={status} />
          {status}
        </span>
      </div>

      <div className="space-y-1 text-xs text-zinc-500">
        <div className="flex items-center justify-between">
          <span>Last run</span>
          <span className="text-zinc-300">{formatTime(lastRun)}</span>
        </div>
        {outputFile && (
          <div className="flex items-start justify-between gap-2">
            <span className="shrink-0">Output</span>
            <span className="truncate text-right font-mono text-zinc-400 max-w-[200px]">
              {outputFile.split("/").pop()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function PipelineStatusCards() {
  const [runs, setRuns] = useState<Record<string, PipelineRun | null>>({});

  useEffect(() => {
    // Load latest run per pipeline
    async function load() {
      const results: Record<string, PipelineRun | null> = {};
      for (const name of PIPELINES) {
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

    // Real-time subscription
    const channel = supabase
      .channel("pipeline_runs")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pipeline_runs" },
        (payload) => {
          const row = payload.new as PipelineRun;
          if (row?.pipeline_name) {
            setRuns((prev) => ({
              ...prev,
              [row.pipeline_name]: row,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Pipeline Status
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PIPELINES.map((name) => (
          <PipelineCard key={name} name={name} run={runs[name] ?? null} />
        ))}
      </div>
    </div>
  );
}
