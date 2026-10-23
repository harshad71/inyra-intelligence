export interface IntakeProfile {
  company_name: string;
  offer: string;
  target_market: string;
  geography: string;
  icp_hypothesis: string;
  differentiators?: string[];
  exclusions?: string[];
}

export interface IntakeRequest {
  text?: string;
  url?: string;
  product?: string;
  geography?: string;
  lead_count?: number;
}

export interface IntakeResponse {
  intake_id: string;
  session_id: string;
  profile: IntakeProfile;
  assumptions: string[];
  confidence: number;
  questions: string[];
}

export interface JobRequest {
  session_id: string;
  intake_id: string;
  profile: IntakeProfile;
  answers?: string[];
  lead_count?: number;
  mode?: "live" | "demo";
}

export interface FitReason {
  reason: string;
  evidence_url: string;
  quote?: string;
}

export interface Lead {
  lead_id: string;
  run_id: string;
  company: string;
  website: string;
  domain: string;
  location: string;
  industry: string;
  segment: string;
  fit_score: number;
  fit_reasons: FitReason[];
  buyer_role: string;
  secondary_role: string;
  outreach_angle: string;
  source_urls: string[];
  verified: boolean;
  created_at: string;
}

export type JobStage =
  | "intake"
  | "kb"
  | "research"
  | "extraction"
  | "qualification"
  | "buyer"
  | "angle"
  | "saving"
  | "done";

export type JobState =
  | "queued"
  | "running"
  | "done"
  | "partial"
  | "failed"
  | "cancelled";

export interface LogEntry {
  t: string;
  msg: string;
}

export interface JobCounts {
  candidates: number;
  verified: number;
  qualified: number;
}

export interface JobStatusResponse {
  run_id: string;
  session_id: string;
  status: JobState;
  stage: JobStage;
  stages: JobStage[];
  progress: number;
  log: LogEntry[];
  counts: JobCounts;
  leads: Lead[];
  summary: string | null;
  airtable_url: string;
  error: string | null;
  started_at: string;
  finished_at: string | null;
  profile?: IntakeProfile;
}

export interface ClarifyingQA {
  question: string;
  answer: string;
}

export interface DemoSession {
  session_id: string;
  created_at: string;
  customer_company: string;
  website?: string;
  raw_input?: string;
  offer?: string;
  target_market?: string;
  geography?: string;
  icp_hypothesis?: string;
  profile?: IntakeProfile;
  clarifying_qa?: ClarifyingQA[];
  assumptions?: string[];
  status: "draft" | "running" | "done" | "partial" | "failed";
  lead_count: number;
  latest_run_id?: string;
  notes?: string;
}

export interface SessionDetailResponse {
  session: DemoSession;
  runs: Array<{
    run_id: string;
    created_at: string;
    status: JobState;
    lead_count: number;
    summary?: string;
    duration_sec?: number;
    est_cost_inr?: number;
    mode?: "live" | "demo";
  }>;
  leads: Lead[];
  airtable_url: string;
}
