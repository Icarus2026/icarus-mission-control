"use client";

import { useEffect, useState } from "react";

const QUEUE_API = process.env.NEXT_PUBLIC_QUEUE_API_URL;

interface NoteData {
  date: string;
  content: string;
  found: boolean;
}

export function DailyNotesFeed() {
  const [note, setNote] = useState<NoteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!QUEUE_API) return;
      try {
        const r = await fetch(`${QUEUE_API}/notes/today`);
        const data = await r.json();
        setNote(data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
    // Refresh every 5 minutes
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Daily Notes{note?.date ? ` — ${note.date}` : ""}
      </h2>
      <div className="flex-1 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        {loading ? (
          <p className="text-sm text-zinc-600">Loading...</p>
        ) : !QUEUE_API ? (
          <p className="text-sm text-zinc-600">Queue API not configured</p>
        ) : !note?.found ? (
          <p className="text-sm text-zinc-600">No note for today yet</p>
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-zinc-300">
            {note.content || "(empty)"}
          </pre>
        )}
      </div>
    </div>
  );
}
