"use client";

import { useState } from "react";
import { SKILLS, STATUS_COUNTS, SkillStatus } from "@/lib/skills-data";

const STATUS_STYLE: Record<SkillStatus, { dot: string; badge: string; label: string }> = {
  active:    { dot: "bg-green-500",  badge: "bg-green-950 text-green-400 border-green-800",   label: "Active" },
  ready:     { dot: "bg-yellow-500", badge: "bg-yellow-950 text-yellow-400 border-yellow-800", label: "Ready" },
  reference: { dot: "bg-zinc-600",   badge: "bg-zinc-800 text-zinc-400 border-zinc-700",       label: "Ref" },
  tooling:   { dot: "bg-blue-500",   badge: "bg-blue-950 text-blue-400 border-blue-800",       label: "Tool" },
};

type Filter = "all" | SkillStatus;

export function SkillsPanel() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = filter === "all" ? SKILLS : SKILLS.filter((s) => s.status === filter);

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all",       label: "All",       count: SKILLS.length },
    { id: "active",    label: "Active",    count: STATUS_COUNTS.active ?? 0 },
    { id: "ready",     label: "Ready",     count: STATUS_COUNTS.ready ?? 0 },
    { id: "reference", label: "Reference", count: STATUS_COUNTS.reference ?? 0 },
    { id: "tooling",   label: "Tooling",   count: STATUS_COUNTS.tooling ?? 0 },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Skills Registry — {SKILLS.length} skills
        </h2>
        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                filter === f.id
                  ? "bg-zinc-700 text-zinc-100"
                  : "bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800"
              }`}
            >
              {f.label} <span className="opacity-60">{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((skill) => {
          const s = STATUS_STYLE[skill.status];
          return (
            <div
              key={skill.name}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 flex flex-col gap-1"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`shrink-0 h-1.5 w-1.5 rounded-full ${s.dot}`} />
                  <span className="font-mono text-xs font-medium text-zinc-100 truncate">
                    {skill.name}
                  </span>
                </div>
                <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded border font-medium ${s.badge}`}>
                  {s.label}
                </span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed pl-3.5">
                {skill.description}
              </p>
              {(skill.trigger || skill.model || skill.port) && (
                <div className="pl-3.5 flex flex-wrap gap-2 pt-0.5">
                  {skill.model && (
                    <span className="text-xs text-blue-400 font-mono">{skill.model}</span>
                  )}
                  {skill.trigger && (
                    <span className="text-xs text-zinc-600">{skill.trigger}</span>
                  )}
                  {skill.port && (
                    <span className="text-xs text-zinc-600">:{skill.port}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
