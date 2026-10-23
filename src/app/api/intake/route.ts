import { NextRequest, NextResponse } from "next/server";
import { IntakeRequest, IntakeResponse, DemoSession, IntakeProfile } from "@/types";
import { mockStore } from "@/lib/mockStore";

export async function POST(req: NextRequest) {
  try {
    const body: IntakeRequest = await req.json();

    if (!body.text?.trim() && !body.url?.trim()) {
      return NextResponse.json(
        { error: { code: "BAD_INPUT", message: "At least one of description text or website URL is required." } },
        { status: 400 }
      );
    }

    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    const n8nKey = process.env.N8N_SECRET_KEY || "";

    // If external n8n is configured and reachable
    if (n8nUrl) {
      try {
        const response = await fetch(`${n8nUrl}/intake`, {
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
        console.warn("n8n intake unreachable, falling back to local engine:", err);
      }
    }

    // Local normalization engine
    const text = (body.text || "").trim();
    const url = (body.url || "").trim();
    const product = (body.product || "").trim();
    const geography = (body.geography || "India").trim();

    const isWaterOrIndustrial =
      text.toLowerCase().includes("water") ||
      text.toLowerCase().includes("ro") ||
      text.toLowerCase().includes("dairy") ||
      text.toLowerCase().includes("plant") ||
      product.toLowerCase().includes("ro");

    const sessionId = `ses_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const intakeId = `int_${Math.random().toString(36).substring(2, 6)}`;

    let profile: IntakeProfile;
    let questions: string[] = [];
    let assumptions: string[] = [];
    let confidence: number;

    if (isWaterOrIndustrial) {
      profile = {
        company_name: url ? url.replace(/https?:\/\/(www\.)?/, "").split("/")[0] : "AquaTech Dynamics",
        offer: product ? `${product} - Industrial Water Treatment` : "Industrial Reverse Osmosis (RO) Plants (20-100 KLD) & Effluent Recycling",
        target_market: "Dairies, breweries, beverage bottling, and food processing facilities",
        geography: geography.includes("Maharashtra") ? geography : `${geography} (Pune, Kolhapur, Baramati industrial belts)`,
        icp_hypothesis: "Commercial liquid food processors facing high TDS groundwater, scaling boilers, or MPCB effluent norms",
        differentiators: ["Guaranteed <30 ppm permeate", "Automated CIP cleaning systems", "Turnkey engineering install"],
        exclusions: ["Domestic water purifiers", "Bottled mineral water retail", "Municipal water supply boards"],
      };

      // If text was concise or no website provided, trigger 1-2 clarifying questions (PRD FR3)
      if (text.length < 90 || !url) {
        confidence = 0.54;
        questions = [
          "Which industries or segments buy most frequently from you today?",
          "What is your target plant capacity or minimum project budget (e.g., 20+ KLD)?",
        ];
        assumptions = ["B2B industrial buyers only", "Focus on western manufacturing corridors", "Excludes consumer filter buyers"];
      } else {
        confidence = 0.88;
        assumptions = ["B2B enterprise contract basis", "Maharashtra state industrial zones"];
      }
    } else {
      // Healthcare / Diagnostics / Corporate Wellness or General B2B
      const companyCandidate = url
        ? url.replace(/https?:\/\/(www\.)?/, "").split(".")[0].toUpperCase() + " Group"
        : "Apex Healthcare & Diagnostics";

      profile = {
        company_name: companyCandidate,
        offer: product || "Corporate Annual Health Checkups, On-Site Phlebotomy Camps & Statutory Executive Wellness",
        target_market: "IT/ITeS campuses, engineering firms, and manufacturing plants with >200 on-site employees",
        geography: geography,
        icp_hypothesis: "Enterprises with hybrid work policies needing wellness perks, plus factories requiring mandatory Form 32/33 medical compliance",
        differentiators: ["NABL accredited mobile screening fleet", "Digital employee portal with same-day reports", "Zero operational downtime on-site"],
        exclusions: ["Third-party pathology franchisees", "Retail walk-in patients", "Hospitals"],
      };

      if (text.length < 90 || !url) {
        confidence = 0.52;
        questions = [
          "Which employee categories are your primary focus (Shopfloor/Factory vs. White-collar Tech)?",
          "Do you provide on-site mobile screening vans or require a fixed clinic setup?",
        ];
        assumptions = ["Focus on corporate accounts with >= 150 employees", "Annual recurring contract model"];
      } else {
        confidence = 0.85;
        assumptions = ["Enterprise B2B wellness accounts", "Direct corporate billing"];
      }
    }

    // Persist as a DemoSession record in status 'draft' (PRD Section 10 & 11)
    const newSession: DemoSession = {
      session_id: sessionId,
      created_at: new Date().toISOString(),
      customer_company: profile.company_name,
      website: url || undefined,
      raw_input: text || `Analyzed website: ${url}`,
      offer: profile.offer,
      target_market: profile.target_market,
      geography: profile.geography,
      icp_hypothesis: profile.icp_hypothesis,
      profile: profile,
      assumptions: assumptions,
      status: "draft",
      lead_count: 0,
      notes: "",
    };

    mockStore.sessions.unshift(newSession);

    const responseData: IntakeResponse = {
      intake_id: intakeId,
      session_id: sessionId,
      profile,
      assumptions,
      confidence,
      questions,
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
