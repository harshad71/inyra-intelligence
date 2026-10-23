import { NextRequest, NextResponse } from "next/server";
import { JobRequest } from "@/types";
import { mockStore, createSimulatedJob } from "@/lib/mockStore";

export async function POST(req: NextRequest) {
  try {
    const body: JobRequest = await req.json();

    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    const n8nKey = process.env.N8N_SECRET_KEY || "";

    if (n8nUrl && body.mode !== "demo") {
      try {
        const response = await fetch(`${n8nUrl}/jobs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-inyra-key": n8nKey,
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json(data);
        }
      } catch (err) {
        console.warn("n8n /jobs webhook failed, falling back to local simulation:", err);
      }
    }

    // Local simulation fallback / demo mode
    const session = mockStore.sessions.find((s) => s.session_id === body.session_id);
    if (session) {
      session.status = "running";
      session.profile = body.profile;
      if (body.answers && body.answers.length > 0) {
        session.clarifying_qa = body.answers.map((ans, idx) => ({
          question: `Clarification ${idx + 1}`,
          answer: ans,
        }));
      }
    }

    const job = createSimulatedJob(body.session_id, body.profile, body.lead_count || 25);
    if (session) {
      session.latest_run_id = job.run_id;
    }

    return NextResponse.json({
      run_id: job.run_id,
      session_id: body.session_id,
      status: "queued",
      airtable_url: job.airtable_url,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message } },
      { status: 500 }
    );
  }
}
