import { NextResponse } from "next/server";
import { SEEDED_SESSIONS } from "@/lib/seed";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = SEEDED_SESSIONS.find((s) => s.id === params.id);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  return NextResponse.json({ session });
}
