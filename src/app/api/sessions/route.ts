import { NextRequest, NextResponse } from "next/server";
import { mockStore } from "@/lib/mockStore";

export async function GET(req: NextRequest) {
  try {
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    const n8nKey = process.env.N8N_SECRET_KEY || "";

    if (n8nUrl) {
      try {
        const response = await fetch(`${n8nUrl}/sessions`, {
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
        console.warn("n8n sessions list failed, falling back to local store:", err);
      }
    }

    return NextResponse.json({
      sessions: mockStore.sessions,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message } },
      { status: 500 }
    );
  }
}
