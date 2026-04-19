import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/auditor";
import type { ChatMessage } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface AuditBody {
  history: ChatMessage[];
  candidateReply: string;
  messageId?: string;
  region?: "IN" | "US" | "Global";
}

export async function POST(req: NextRequest) {
  let body: AuditBody;
  try {
    body = (await req.json()) as AuditBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!Array.isArray(body.history)) {
    return NextResponse.json({ error: "history must be an array" }, { status: 400 });
  }
  if (typeof body.candidateReply !== "string") {
    return NextResponse.json(
      { error: "candidateReply must be a string" },
      { status: 400 },
    );
  }

  const gemini = req.headers.get("x-user-gemini-key") || undefined;
  const groq = req.headers.get("x-user-groq-key") || undefined;
  const region =
    (req.headers.get("x-user-region") as "IN" | "US" | "Global" | null) ||
    body.region ||
    "Global";

  try {
    const audit = await runAudit({
      history: body.history,
      candidateReply: body.candidateReply,
      messageId: body.messageId ?? "candidate",
      region,
      keys: { gemini, groq },
    });
    return NextResponse.json({ audit });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Audit failed",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: "Tether AI Safety Audit",
    method: "POST",
    body: {
      history: "ChatMessage[] — full conversation so far",
      candidateReply: "string — the assistant message to audit (not yet shown to user)",
      messageId: "string (optional)",
      region: "'IN' | 'US' | 'Global' (optional, defaults to 'Global')",
    },
    headers: {
      "x-user-gemini-key": "Optional. Your Gemini API key.",
      "x-user-groq-key": "Optional. Your Groq API key (fallback auditor).",
      "x-user-region": "Optional. Override response card region.",
    },
    example: {
      curl:
        'curl -X POST https://<host>/api/audit -H "content-type: application/json" -H "x-user-gemini-key: $GEMINI" -d \'{"history":[],"candidateReply":"You are absolutely right!"}\'',
    },
  });
}
