import { NextRequest, NextResponse } from "next/server";
import { mockStore } from "@/lib/mockStore";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const runId = params.id;

    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    const n8nKey = process.env.N8N_SECRET_KEY || "";

    if (n8nUrl) {
      try {
        const response = await fetch(`${n8nUrl}/jobs/${runId}`, {
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
        console.warn(`n8n job status poll failed for ${runId}, falling back to store:`, err);
      }
    }

    const job = mockStore.jobs.get(runId);
    if (!job) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: `Run ID ${runId} not found.` } },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message } },
      { status: 500 }
    );
  }
}
