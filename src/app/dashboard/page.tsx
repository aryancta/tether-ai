"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Eye,
  Play,
  Pause,
  ShieldCheck,
  Filter,
  Languages,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrajectoryChart } from "@/components/trajectory-chart";
import { AxisBars } from "@/components/axis-bars";
import { RiskGauge } from "@/components/risk-gauge";
import { ChatBubble } from "@/components/chat-bubble";
import { ResourceCardView } from "@/components/resource-card-view";
import { SEEDED_SESSIONS, summaryStats } from "@/lib/seed";
import { AXES, AXIS_META, type RiskAxis } from "@/lib/types";
import { cn, formatTime } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export default function DashboardPage() {
  const stats = React.useMemo(() => summaryStats(), []);
  const sessions = SEEDED_SESSIONS;
  const [activeId, setActiveId] = React.useState<string>(sessions[0].id);
  const [selectedMsg, setSelectedMsg] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<"all" | "flagged" | "ok">("all");
  const [live, setLive] = React.useState(true);
  const [now, setNow] = React.useState(0);
  const { toast } = useToast();

  const filtered = sessions.filter((s) =>
    filter === "all" ? true : filter === "flagged" ? s.flagged : !s.flagged,
  );
  const active = sessions.find((s) => s.id === activeId) ?? sessions[0];

  // "Live" pulse — animates a sweep of the trajectory points one by one
  React.useEffect(() => {
    if (!live) return;
    setNow(0);
    const id = setInterval(() => {
      setNow((n) => {
        if (!active) return n;
        if (n >= active.trajectory.length) return active.trajectory.length;
        return n + 1;
      });
    }, 600);
    return () => clearInterval(id);
  }, [live, activeId, active]);

  const visibleTrajectory = live ? active.trajectory.slice(0, now) : active.trajectory;

  const auditForSelected = active.audits.find((a) => a.messageId === selectedMsg);
  const headlineAudit =
    auditForSelected ??
    [...active.audits].sort((a, b) => b.overall - a.overall)[0] ??
    active.audits[0];

  const axisTotals = React.useMemo(() => {
    const acc: Record<RiskAxis, number> = {
      crisis_escalation: 0,
      delusion_reinforcement: 0,
      stigma: 0,
      sycophancy: 0,
      trajectory_drift: 0,
    };
    let n = 0;
    for (const s of sessions) {
      for (const a of s.audits) {
        for (const ax of a.axes) acc[ax.axis] += ax.score;
        n++;
      }
    }
    if (n === 0) return acc;
    for (const k of Object.keys(acc) as RiskAxis[]) acc[k] = acc[k] / n;
    return acc;
  }, [sessions]);

  return (
    <div className="container py-8">
      <header className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="default" className="mb-2">
            <Activity className="h-3 w-3" />
            Live safety dashboard
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Every session, every axis, every drift.
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            What a safety operator at a digital-health platform would see all day. Each
            row is a real conversation with an AI companion; click any to inspect the
            trajectory, the per-message audit, and the interventions Tether triggered.
          </p>
        </div>
        <Button
          variant={live ? "default" : "outline"}
          onClick={() => setLive((v) => !v)}
          size="sm"
        >
          {live ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {live ? "Pause live replay" : "Resume live replay"}
        </Button>
      </header>

      {/* KPI strip */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Sessions audited" value={stats.sessions} icon={<Eye className="h-3.5 w-3.5" />} />
        <Kpi
          label="Interventions triggered"
          value={stats.interventions}
          icon={<ShieldCheck className="h-3.5 w-3.5" />}
          tone="ok"
        />
        <Kpi
          label="Helplines surfaced"
          value={stats.helplines}
          icon={<AlertTriangle className="h-3.5 w-3.5" />}
          tone="warn"
        />
        <Kpi
          label="Trajectory-drift hits"
          value={stats.driftHits}
          icon={<TrendingUp className="h-3.5 w-3.5" />}
          tone="danger"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        {/* SESSION LIST */}
        <aside className="space-y-3">
          <Card className="glass">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                  <Filter className="h-3 w-3" /> Sessions
                </div>
                <div className="flex gap-1 text-[10px]">
                  {(["all", "flagged", "ok"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={cn(
                        "rounded-full px-2 py-0.5 uppercase tracking-wider",
                        filter === f
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/60 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <ul className="space-y-2">
                {filtered.map((s) => {
                  const max = Math.max(0, ...s.audits.map((a) => a.overall));
                  const isActive = s.id === active.id;
                  return (
                    <li key={s.id}>
                      <button
                        onClick={() => {
                          setActiveId(s.id);
                          setSelectedMsg(null);
                          setNow(0);
                        }}
                        className={cn(
                          "group w-full rounded-lg border p-3 text-left transition-colors",
                          isActive
                            ? "border-primary/50 bg-primary/10"
                            : "border-border/60 bg-secondary/20 hover:border-border hover:bg-secondary/40",
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <Badge
                            variant={
                              max >= 70 ? "danger" : max >= 40 ? "warn" : "ok"
                            }
                            className="h-5"
                          >
                            risk {Math.round(max)}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {formatTime(s.startedAt)}
                          </span>
                        </div>
                        <div className="mt-1.5 line-clamp-2 text-sm font-medium text-foreground">
                          {s.title}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                          <Languages className="h-3 w-3" />
                          {s.language}
                          <span>·</span>
                          {s.messages.length} turns
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          {/* Cohort axis averages */}
          <Card className="glass">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                <TrendingUp className="h-3 w-3" /> Cohort axis averages
              </div>
              <AxisBars
                compact
                axes={AXES.map((a) => ({
                  axis: a,
                  score: Math.round(axisTotals[a]),
                  evidence: AXIS_META[a].source,
                }))}
              />
            </CardContent>
          </Card>
        </aside>

        {/* MAIN */}
        <section className="space-y-4">
          <Card className="glass">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Active session · {active.id}
                  </div>
                  <h2 className="mt-1 text-xl font-semibold">{active.title}</h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    {active.summary}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Session forwarded",
                      description: `Tether sent ${active.id} to a human reviewer queue.`,
                      variant: "ok",
                    });
                  }}
                >
                  Escalate to clinician
                </Button>
              </div>
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Session trajectory
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    {visibleTrajectory.length}/{active.trajectory.length} turns ·{" "}
                    {live ? "auto-replay" : "static"}
                  </span>
                </div>
                <TrajectoryChart
                  points={visibleTrajectory}
                  height={240}
                  selected={selectedMsg}
                  onSelect={(id) => setSelectedMsg(id)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <Card className="glass">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Conversation</h3>
                  <span className="text-[11px] text-muted-foreground">
                    Click any assistant turn to inspect →
                  </span>
                </div>
                <div className="scrollbar-thin h-[440px] space-y-3 overflow-y-auto pr-1">
                  {active.messages.map((m, i) => {
                    const id = `m_${i}`;
                    const audit = active.audits.find((a) => a.messageId === id);
                    // Don't render resource card inside the row click target
                    // (avoid nested interactive HTML).
                    const wrapped = {
                      id,
                      role: m.role,
                      content: m.content,
                      timestamp: m.timestamp,
                      audit: audit
                        ? { ...audit, resourceCard: undefined }
                        : undefined,
                    };
                    return (
                      <div
                        key={id}
                        role={audit ? "button" : undefined}
                        tabIndex={audit ? 0 : -1}
                        onClick={() => audit && setSelectedMsg(id)}
                        onKeyDown={(e) => {
                          if (audit && (e.key === "Enter" || e.key === " ")) {
                            e.preventDefault();
                            setSelectedMsg(id);
                          }
                        }}
                        className={cn(
                          "block w-full cursor-pointer rounded-md px-1.5 py-1.5 text-left transition-colors",
                          audit && id === selectedMsg
                            ? "bg-primary/5"
                            : "hover:bg-secondary/30",
                        )}
                      >
                        <ChatBubble message={wrapped} variant="danger" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold">Per-message audit</h3>
                {headlineAudit ? (
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <RiskGauge score={headlineAudit.overall} size={120} />
                      <div className="flex-1 space-y-2 text-xs">
                        <Badge
                          variant={
                            headlineAudit.verdict === "ok"
                              ? "ok"
                              : headlineAudit.verdict === "caution"
                                ? "warn"
                                : "danger"
                          }
                        >
                          {headlineAudit.verdict.toUpperCase()}
                        </Badge>
                        <p className="leading-snug text-foreground/80">
                          {headlineAudit.rationale}
                        </p>
                        <div className="text-[10px] text-muted-foreground">
                          via {headlineAudit.source} · {headlineAudit.latencyMs} ms
                        </div>
                      </div>
                    </div>
                    <AxisBars axes={headlineAudit.axes} />
                    {headlineAudit.rewrite ? (
                      <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-xs leading-snug">
                        <div className="mb-1 font-semibold text-primary">
                          Suggested safer rewrite
                        </div>
                        <div className="text-foreground/85 italic">
                          &ldquo;{headlineAudit.rewrite}&rdquo;
                        </div>
                      </div>
                    ) : null}
                    {headlineAudit.resourceCard ? (
                      <ResourceCardView card={headlineAudit.resourceCard} />
                    ) : null}
                  </div>
                ) : (
                  <div className="mt-4 rounded-md border border-dashed border-border/60 bg-secondary/20 p-4 text-xs text-muted-foreground">
                    No audits in this session.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="glass">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Need to dig deeper?</h3>
                <Link
                  href={`/replay/${active.id}`}
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Open in clinician replay →
                </Link>
              </div>
              <p className="text-xs text-muted-foreground">
                Replay mode lets researchers and clinicians annotate, export, and
                compare flagged sessions over time.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: "ok" | "warn" | "danger";
}) {
  const ring =
    tone === "ok"
      ? "ring-ok/30"
      : tone === "warn"
        ? "ring-warn/30"
        : tone === "danger"
          ? "ring-danger/30"
          : "ring-border";
  const txt =
    tone === "ok"
      ? "text-ok"
      : tone === "warn"
        ? "text-warn"
        : tone === "danger"
          ? "text-danger"
          : "text-primary";
  return (
    <Card className={cn("glass ring-1", ring)}>
      <CardContent className="flex items-center gap-3 p-4">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md bg-secondary/80",
            txt,
          )}
        >
          {icon}
        </span>
        <div>
          <div className="font-mono text-2xl font-semibold tabular-nums">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
