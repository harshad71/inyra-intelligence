import { NextRequest, NextResponse } from "next/server";
import { mockStore } from "@/lib/mockStore";
import { SessionDetailResponse } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    const n8nKey = process.env.N8N_SECRET_KEY || "";

    if (n8nUrl) {
      try {
        const response = await fetch(`${n8nUrl}/sessions/${sessionId}`, {
          method: "GET",
          headers: {
            "x-inyra-key": n8nKey,
          },
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json(data);
        }
      } catch (err) {
        console.warn(`n8n get session ${sessionId} failed, falling back:`, err);
      }
    }

    const session = mockStore.sessions.find((s) => s.session_id === sessionId);
    if (!session) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: `Session ${sessionId} not found.` } },
        { status: 404 }
      );
    }

    const latestRunId = session.latest_run_id;
    const job = latestRunId ? mockStore.jobs.get(latestRunId) : null;

    const responseData: SessionDetailResponse = {
      session,
      runs: job
        ? [
            {
              run_id: job.run_id,
              created_at: job.started_at,
              status: job.status,
              lead_count: job.leads.length,
              summary: job.summary || undefined,
              duration_sec: 194,
              est_cost_inr: 85,
              mode: "live",
            },
          ]
        : [],
      leads: job ? job.leads : [],
      airtable_url: job ? job.airtable_url : "https://airtable.com/appINyraDemo",
    };

    return NextResponse.json(responseData);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const body = await req.json();

    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    const n8nKey = process.env.N8N_SECRET_KEY || "";

    if (n8nUrl) {
      try {
        await fetch(`${n8nUrl}/sessions/${sessionId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-inyra-key": n8nKey,
          },
          body: JSON.stringify(body),
        });
      } catch (err) {
        console.warn(`n8n patch notes failed for ${sessionId}:`, err);
      }
    }

    const session = mockStore.sessions.find((s) => s.session_id === sessionId);
    if (session && typeof body.notes === "string") {
      session.notes = body.notes;
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message } },
      { status: 500 }
    );
  }
}
