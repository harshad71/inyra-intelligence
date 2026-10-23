import { DemoSession, JobStatusResponse, Lead, IntakeProfile } from "@/types";
import sample1 from "../../public/samples/sample-1.json";
import sample2 from "../../public/samples/sample-2.json";

// In-memory store for active jobs and demo sessions (persists across API requests in Node process)
interface GlobalMockStore {
  sessions: DemoSession[];
  jobs: Map<string, JobStatusResponse>;
}

const globalForMock = globalThis as unknown as {
  __mockStore?: GlobalMockStore;
};

function initStore(): GlobalMockStore {
  const initialSessions: DemoSession[] = [
    {
      session_id: "ses_20261017_diag91",
      created_at: "2026-10-17T09:45:00+05:30",
      customer_company: "Apex Diagnostics & Wellness",
      website: "https://apexdiagnostics.in",
      raw_input: "We offer corporate health check packages and executive wellness camps for IT and manufacturing plants in Pune.",
      offer: "On-site Corporate Health Checkups & Statutory Screening",
      target_market: "IT/ITeS enterprises, automotive OEMs, and manufacturing plants (>200 staff)",
      geography: "Pune & Maharashtra, India",
      icp_hypothesis: "Tech parks in Hinjawadi/Magarpatta and auto OEMs in Chakan needing annual health compliance",
      profile: sample1.profile as IntakeProfile,
      clarifying_qa: [
        {
          question: "Which industries buy most from you today?",
          answer: "IT tech parks and automotive manufacturing plants",
        },
        {
          question: "What minimum employee headcount do you require on site?",
          answer: "At least 150-200 employees for on-premise mobile vans",
        },
      ],
      assumptions: ["B2B corporate wellness", "Maharashtra state only"],
      status: "done",
      lead_count: sample1.leads.length,
      latest_run_id: "run_20261017_diag91",
      notes: "Met with Dr. Kulkarni. Very impressed with the Hinjawadi IT cluster leads. Promised to send CSV report by Monday morning.",
    },
    {
      session_id: "ses_20261016_aqua22",
      created_at: "2026-10-16T14:10:00+05:30",
      customer_company: "JalShakti Water Technologies",
      website: "https://jalshaktiwater.com",
      raw_input: "We make industrial RO water plants for dairies and beverage factories in Maharashtra",
      offer: "Turnkey Industrial RO Plants (20 to 100 KLD) & ZLD",
      target_market: "Dairies, breweries, fruit pulp and beverage bottlers",
      geography: "Maharashtra, India",
      icp_hypothesis: "Food and liquid processors with borewell TDS >1000 ppm facing MPCB effluent recycling rules",
      profile: sample2.profile as IntakeProfile,
      clarifying_qa: [
        {
          question: "What is the typical plant capacity required?",
          answer: "25 KLD to 80 KLD skid-mounted units",
        },
      ],
      assumptions: ["B2B industrial buyers", "Western Maharashtra corridor"],
      status: "done",
      lead_count: sample2.leads.length,
      latest_run_id: "run_20261016_aqua22",
      notes: "Owner requested focus on Kolhapur and Baramati dairy belts. 22 verified leads with plant head roles shown in Airtable.",
    },
  ];

  const jobsMap = new Map<string, JobStatusResponse>();
  jobsMap.set("run_20261017_diag91", sample1 as unknown as JobStatusResponse);
  jobsMap.set("run_20261016_aqua22", sample2 as unknown as JobStatusResponse);

  return {
    sessions: initialSessions,
    jobs: jobsMap,
  };
}

export const mockStore = globalForMock.__mockStore || initStore();
if (process.env.NODE_ENV !== "production") {
  globalForMock.__mockStore = mockStore;
}

export function createSimulatedJob(
  sessionId: string,
  profile: IntakeProfile,
  leadCount: number = 25
): JobStatusResponse {
  const runId = `run_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  const sample =
    profile.offer.toLowerCase().includes("water") ||
    profile.offer.toLowerCase().includes("ro") ||
    profile.offer.toLowerCase().includes("dairy")
      ? sample2
      : sample1;

  const initialJob: JobStatusResponse = {
    run_id: runId,
    session_id: sessionId,
    status: "running",
    stage: "intake",
    stages: [
      "intake",
      "kb",
      "research",
      "extraction",
      "qualification",
      "buyer",
      "angle",
      "saving",
      "done",
    ],
    progress: 10,
    started_at: new Date().toISOString(),
    finished_at: null,
    airtable_url: `https://airtable.com/appINyraDemo/tblRuns?filter=${runId}`,
    summary: null,
    error: null,
    counts: {
      candidates: 12,
      verified: 0,
      qualified: 0,
    },
    leads: [],
    profile: profile,
    log: [
      {
        t: new Date().toISOString(),
        msg: `Job initialized for ${profile.company_name || "target client"}. Building custom knowledge base.`,
      },
    ],
  };

  mockStore.jobs.set(runId, initialJob);

  // Background progress simulation that steps smoothly
  const startTime = Date.now();
  const totalDuration = 18000; // ~18 seconds for snappy demo experience
  const targetLeads = (sample.leads as Lead[]).slice(0, Math.min(leadCount, sample.leads.length));

  const interval = setInterval(() => {
    const job = mockStore.jobs.get(runId);
    if (!job || job.status === "cancelled") {
      clearInterval(interval);
      return;
    }

    const elapsed = Date.now() - startTime;
    const pct = Math.min(Math.floor((elapsed / totalDuration) * 100), 100);

    job.progress = pct;

    if (pct < 20) {
      job.stage = "kb";
      if (job.log.length < 2) {
        job.log.push({
          t: new Date().toISOString(),
          msg: `Synthesizing search vectors and domain exclusions for ${profile.geography}...`,
        });
        job.counts.candidates = 28;
      }
    } else if (pct < 45) {
      job.stage = "research";
      if (job.log.length < 3) {
        job.log.push({
          t: new Date().toISOString(),
          msg: `Scraping public registry & SERP indexes. Identified 64 candidate domains.`,
        });
        job.counts.candidates = 64;
      }
    } else if (pct < 65) {
      job.stage = "extraction";
      if (job.log.length < 4) {
        job.log.push({
          t: new Date().toISOString(),
          msg: `Verifying live HTTP 2xx web domains and filtering directories...`,
        });
        job.counts.verified = 42;
      }
    } else if (pct < 85) {
      job.stage = "qualification";
      if (job.log.length < 5) {
        job.log.push({
          t: new Date().toISOString(),
          msg: `Scoring ICP fit against buyer signals & recent expansion filings...`,
        });
      }
      // Stream partial leads into the results!
      const leadSliceCount = Math.floor((pct - 65) / 5) * 4;
      job.leads = targetLeads.slice(0, Math.max(3, Math.min(leadSliceCount, targetLeads.length)));
      job.counts.qualified = job.leads.length;
    } else if (pct < 98) {
      job.stage = "angle";
      if (job.log.length < 6) {
        job.log.push({
          t: new Date().toISOString(),
          msg: `Generating tailored buyer outreach hooks with verified evidence URLs...`,
        });
      }
      const leadSliceCount = Math.floor((pct - 85) / 3) * 6;
      job.leads = targetLeads.slice(0, Math.max(job.leads.length, Math.min(leadSliceCount, targetLeads.length)));
      job.counts.qualified = job.leads.length;
    } else {
      // Completed!
      job.stage = "done";
      job.status = "done";
      job.progress = 100;
      job.finished_at = new Date().toISOString();
      job.leads = targetLeads;
      job.counts.qualified = targetLeads.length;
      job.counts.verified = Math.floor(targetLeads.length * 1.8);
      job.counts.candidates = Math.floor(targetLeads.length * 2.9);
      job.summary = sample.summary;
      job.log.push({
        t: new Date().toISOString(),
        msg: `Done. ${targetLeads.length} qualified leads compiled and synced to Airtable.`,
      });

      // Update session status in store
      const session = mockStore.sessions.find((s) => s.session_id === sessionId);
      if (session) {
        session.status = "done";
        session.lead_count = targetLeads.length;
        session.latest_run_id = runId;
      }

      clearInterval(interval);
    }
  }, 1200);

  return initialJob;
}
