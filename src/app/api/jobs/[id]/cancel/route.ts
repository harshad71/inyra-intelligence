import { NextRequest, NextResponse } from "next/server";
import { mockStore } from "@/lib/mockStore";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const runId = params.id;
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    const n8nKey = process.env.N8N_SECRET_KEY || "";

    if (n8nUrl) {
      try {
        await fetch(`${n8nUrl}/jobs/${runId}/cancel`, {
          method: "POST",
          headers: {
            "x-inyra-key": n8nKey,
          },
        });
      } catch (err) {
        console.warn("n8n cancel error:", err);
      }
    }

    const job = mockStore.jobs.get(runId);
    if (job) {
      job.status = "cancelled";
      job.log.push({
        t: new Date().toISOString(),
        msg: "Job run cancelled by operator.",
      });
    }

    return NextResponse.json({ status: "cancelled" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message } },
      { status: 500 }
    );
  }
}
