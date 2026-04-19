"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Download,
  FileSearch,
  Pause,
  Play,
  StickyNote,
  StepForward,
  StepBack,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/input";
import { TrajectoryChart } from "@/components/trajectory-chart";
import { AxisBars } from "@/components/axis-bars";
import { RiskGauge } from "@/components/risk-gauge";
import { ChatBubble } from "@/components/chat-bubble";
import { ResourceCardView } from "@/components/resource-card-view";
import { SEEDED_SESSIONS } from "@/lib/seed";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export default function SessionReplayPage({ params }: { params: { id: string } }) {
  const session = SEEDED_SESSIONS.find((s) => s.id === params.id);
  const { toast } = useToast();
  const [stepIdx, setStepIdx] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [annotations, setAnnotations] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (!session) return;
    if (!playing) return;
    const id = setInterval(() => {
      setStepIdx((s) => Math.min(s + 1, session.messages.length));
    }, 700);
    return () => clearInterval(id);
  }, [playing, session]);

  if (!session) {
    return notFound();
  }

  const visibleMsgs = session.messages.slice(0, Math.max(1, stepIdx));
  const visibleAudits = session.audits.filter(
    (a) =>
      session.messages.findIndex(
        (m, i) => `m_${i}` === a.messageId,
      ) <
      stepIdx,
  );
  const lastAudit = visibleAudits[visibleAudits.length - 1];
  const visibleTraj = session.trajectory.slice(0, visibleAudits.length);

  const exportSession = () => {
    const payload = {
      id: session.id,
      title: session.title,
      messages: session.messages,
      audits: session.audits,
      annotations,
      trajectory: session.trajectory,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${session.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Session exported", variant: "ok" });
  };

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/replay"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> All sessions
          </Link>
          <Badge variant="default" className="mt-2">
            <FileSearch className="h-3 w-3" /> Replay
          </Badge>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            {session.title}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{session.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setStepIdx(1)}>
            <StepBack className="h-3.5 w-3.5" /> Restart
          </Button>
          <Button
            variant={playing ? "default" : "outline"}
            size="sm"
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? "Pause" : "Play"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStepIdx((s) => Math.min(s + 1, session.messages.length))}
          >
            <StepForward className="h-3.5 w-3.5" /> Step
          </Button>
          <Button variant="gradient" size="sm" onClick={exportSession}>
            <Download className="h-3.5 w-3.5" /> Export JSON
          </Button>
        </div>
      </div>

      <Card className="glass mb-4">
        <CardContent className="p-5">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Trajectory · turns {visibleAudits.length}/{session.audits.length}</span>
            <span>{session.language}</span>
          </div>
          <TrajectoryChart points={visibleTraj} height={220} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="scrollbar-thin h-[520px] space-y-3 overflow-y-auto pr-1">
              {visibleMsgs.map((m, i) => {
                const id = `m_${i}`;
                const audit = session.audits.find((a) => a.messageId === id);
                return (
                  <div key={id} className="space-y-2">
                    <ChatBubble
                      message={{
                        id,
                        role: m.role,
                        content: m.content,
                        timestamp: m.timestamp,
                        audit,
                      }}
                      variant="danger"
                    />
                    {audit ? (
                      <div className={cn("ml-9 flex items-center gap-2 text-[10px]")}>
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 font-medium uppercase tracking-wider",
                            audit.verdict === "ok"
                              ? "bg-ok/15 text-ok"
                              : audit.verdict === "caution"
                                ? "bg-warn/15 text-warn"
                                : "bg-danger/15 text-danger",
                          )}
                        >
                          {audit.verdict} · risk {Math.round(audit.overall)}
                        </span>
                        <span className="text-muted-foreground">{audit.rationale}</span>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {lastAudit ? (
            <Card className="glass">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Latest audit</h3>
                  <Badge
                    variant={
                      lastAudit.verdict === "ok"
                        ? "ok"
                        : lastAudit.verdict === "caution"
                          ? "warn"
                          : "danger"
                    }
                  >
                    {lastAudit.verdict}
                  </Badge>
                </div>
                <div className="flex items-start gap-3">
                  <RiskGauge score={lastAudit.overall} size={120} />
                  <div className="flex-1 text-xs text-muted-foreground">
                    {lastAudit.rationale}
                  </div>
                </div>
                <AxisBars axes={lastAudit.axes} />
                {lastAudit.rewrite ? (
                  <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-xs italic">
                    Suggested rewrite: &ldquo;{lastAudit.rewrite}&rdquo;
                  </div>
                ) : null}
                {lastAudit.resourceCard ? (
                  <ResourceCardView card={lastAudit.resourceCard} />
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          <Card className="glass">
            <CardContent className="space-y-2 p-5">
              <div className="flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Clinician notes</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Annotate the latest visible turn. Notes are saved with the
                exported JSON for IRB / research review.
              </p>
              <Textarea
                value={annotations[`step_${stepIdx}`] ?? ""}
                onChange={(e) =>
                  setAnnotations((a) => ({ ...a, [`step_${stepIdx}`]: e.target.value }))
                }
                placeholder="e.g. Bot validated paranoid claim; should have offered helpline + clinician contact."
                rows={4}
              />
              <div className="text-[10px] text-muted-foreground">
                Notes attached: {Object.keys(annotations).filter((k) => annotations[k]).length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
