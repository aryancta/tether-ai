import { NextResponse } from "next/server";
import { SEEDED_SESSIONS, summaryStats } from "@/lib/seed";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    stats: summaryStats(),
    sessions: SEEDED_SESSIONS.map((s) => ({
      id: s.id,
      title: s.title,
      patientPersona: s.patientPersona,
      language: s.language,
      startedAt: s.startedAt,
      flagged: s.flagged,
      summary: s.summary,
      messageCount: s.messages.length,
      auditCount: s.audits.length,
      maxRisk: Math.max(0, ...s.audits.map((a) => a.overall)),
    })),
  });
}
