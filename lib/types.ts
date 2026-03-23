export interface PipelineRun {
  id: string;
  pipeline_name: string;
  status: "running" | "completed" | "failed" | "idle";
  started_at: string | null;
  completed_at: string | null;
  output_file: string | null;
  created_at: string;
}

export interface AgentHealth {
  id: string;
  cron_name: string;
  consecutive_errors: number;
  last_run: string | null;
  last_status: string | null;
  updated_at: string;
}

export interface QueueTask {
  id: number;
  source: string;
  content: string;
  priority: number;
  status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
  processed_at: string | null;
  failure_count: number;
}

export interface QueueResponse {
  tasks: QueueTask[];
  counts: {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };
  error?: string;
}
