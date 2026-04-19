import { NextRequest, NextResponse } from "next/server";
import { generateCompanionReply } from "@/lib/companion";
import type { ChatMessage } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CompanionBody {
  history: ChatMessage[];
  mode: "dangerous" | "safe";
}

export async function POST(req: NextRequest) {
  let body: CompanionBody;
  try {
    body = (await req.json()) as CompanionBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!Array.isArray(body.history)) {
    return NextResponse.json({ error: "history must be an array" }, { status: 400 });
  }
  if (body.mode !== "dangerous" && body.mode !== "safe") {
    return NextResponse.json(
      { error: "mode must be 'dangerous' or 'safe'" },
      { status: 400 },
    );
  }
  const geminiKey = req.headers.get("x-user-gemini-key") || undefined;
  try {
    const result = await generateCompanionReply({
      history: body.history,
      mode: body.mode,
      geminiKey,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      {
        error: "Companion failed",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
