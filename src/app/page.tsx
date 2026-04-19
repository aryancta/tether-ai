import Link from "next/link";
import {
  ArrowRight,
  Activity,
  Shield,
  LineChart,
  GitBranch,
  Globe,
  Mic,
  PlayCircle,
  Quote,
  Stethoscope,
  Webhook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { summaryStats } from "@/lib/seed";
import { AXIS_META, AXES } from "@/lib/types";

export default function HomePage() {
  const stats = summaryStats();
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div className="flex flex-col">
              <Badge variant="default" className="w-fit">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                Built for STEMINATE HACKS 2026 · Health × ML/AI × Social Good
              </Badge>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
                The safety layer every{" "}
                <span className="gradient-text">mental-health AI</span>{" "}
                should have shipped with.
              </h1>
              <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
                Tether AI is a real-time copilot that audits any LLM mental-health
                conversation for crisis cues, delusion reinforcement, stigma,
                sycophancy, and multi-turn trajectory drift — and intervenes
                before harm reaches the user.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="gradient">
                  <Link href="/sandbox">
                    <PlayCircle className="h-4 w-4" />
                    Open the Dangerous-vs-Tether sandbox
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/dashboard">
                    Live safety dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 text-sm">
                <Stat label="Sessions audited" value={stats.sessions} />
                <Stat label="Interventions" value={stats.interventions} />
                <Stat label="Helplines surfaced" value={stats.helplines} />
              </div>
            </div>

            {/* HERO RIGHT — illustrative split-screen preview */}
            <HeroSplitPreview />
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="container py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Badge variant="danger" className="mb-3">
              The problem judges should know about
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Mental-health chatbots are failing — quietly, for months at a time.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Five peer-reviewed papers in 2025–2026 documented the same pattern:
              popular AI companions miss subtle suicidality (Pichowicz et al.,
              Nature Sci Rep 2025), validate paranoid beliefs (JMIR 2026
              trajectory viewpoint), stigmatize schizophrenia and addiction
              (Brown / Iftikhar 2025; Stanford HAI 2025), and reward emotional
              dependency over time (PMC Digital Psychiatry 2025).
            </p>
            <p className="mt-4 text-muted-foreground">
              Single-turn safety benchmarks miss it. The harm{" "}
              <span className="text-foreground font-medium">
                accumulates across the conversation
              </span>
              . That is the gap Tether closes.
            </p>
          </div>
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <Quote className="h-3.5 w-3.5" />
                from JMIR Mental Health, April 2026
              </div>
              <blockquote className="mt-3 text-lg italic leading-snug text-foreground/90">
                &ldquo;It is the journey, not the destination. Risk in chatbot
                mental-health conversations accumulates over extended dialogue.
                Prevailing end-point evaluations miss it entirely.&rdquo;
              </blockquote>
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                <FactRow value="29" label="chatbots tested for C-SSRS — most failed to escalate" />
                <FactRow value="60%+" label="of multi-turn ethics violations missed by single-turn benchmarks" />
                <FactRow value="0" label="open, drop-in trajectory-aware safety layers existed before Tether" />
                <FactRow value="$0" label="cost — entire stack runs on free tiers" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FIVE AXES */}
      <section className="container py-20">
        <div className="mb-10 max-w-3xl">
          <Badge variant="accent">The five-axis live auditor</Badge>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Every reply, scored on the five documented failure modes — in real time.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Each axis is grounded in a 2025–2026 peer-reviewed source. The
            auditor sees the entire transcript in a single 1M-context Gemini
            2.5 Flash call — no fragile multi-agent graph required.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {AXES.map((axis, i) => {
            const meta = AXIS_META[axis];
            const Icon = AXIS_ICONS[i];
            return (
              <Card key={axis} className="glass transition-transform hover:-translate-y-0.5">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary/80 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="font-semibold">{meta.label}</div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {meta.description}
                  </p>
                  <div className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground/80">
                    Source · {meta.source}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container py-20">
        <div className="mb-10 max-w-3xl">
          <Badge variant="default">How it works</Badge>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            One drop-in API call. One independent auditor. One trajectory view.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              i: "01",
              title: "Your chatbot generates a reply",
              body: "Whether you use Gemini, GPT, Claude, Llama, or a fine-tune — Tether is model-agnostic. Send the last N turns + the candidate reply to /api/audit.",
              icon: <Webhook className="h-4 w-4" />,
            },
            {
              i: "02",
              title: "An independent auditor scores it",
              body: "A second LLM (Gemini 2.5 Flash by default, Groq Llama 3.3 70B fallback) evaluates the FULL transcript on five research-backed axes.",
              icon: <Shield className="h-4 w-4" />,
            },
            {
              i: "03",
              title: "Tether intervenes if needed",
              body: "Above threshold, Tether returns a safer rewrite, a region-aware crisis card (iCall, Vandrevala, 988), or a human-handoff signal.",
              icon: <LineChart className="h-4 w-4" />,
            },
          ].map((s) => (
            <Card key={s.i} className="glass relative overflow-hidden">
              <div className="absolute right-3 top-3 font-mono text-xs text-muted-foreground/60">
                {s.i}
              </div>
              <CardContent className="p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-primary/30 to-accent/30 text-primary">
                  {s.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* WHO BENEFITS */}
      <section className="container py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {AUDIENCES.map((a) => (
            <Card key={a.title} className="glass">
              <CardContent className="p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-primary">
                  <a.icon className="h-4 w-4" />
                </span>
                <h3 className="mt-4 font-semibold">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-primary/15 via-card to-accent/15">
          <CardContent className="grid gap-6 p-10 lg:grid-cols-[2fr_1fr] lg:items-center">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                See Tether catch a harm a raw chatbot misses — in 60 seconds.
              </h3>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Open the split-screen sandbox, type a realistic message
                (&ldquo;I&rsquo;ve been talking to this bot for weeks and I think
                my family really is poisoning me&hellip;&rdquo;) and watch the
                trajectory view light up on the right while a raw companion
                cheerfully validates on the left.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild size="lg" variant="gradient">
                <Link href="/sandbox">
                  <PlayCircle className="h-4 w-4" />
                  Open sandbox
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/sdk">Read the SDK docs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

const AXIS_ICONS = [Shield, Activity, Stethoscope, LineChart, GitBranch];

const AUDIENCES = [
  {
    title: "Indie devs & student teams",
    icon: GitBranch,
    body:
      "Building a wellness chatbot for a hackathon, dorm room, or side project? Drop Tether in front of your model in one HTTP call instead of writing your own safety layer from scratch.",
  },
  {
    title: "Digital-health platforms in India",
    icon: Globe,
    body:
      "NGOs, college counseling cells, and Wysa-style apps deploying LLMs to Hindi/English users. Tether ships with iCall, Vandrevala, and AASRA referrals out of the box.",
  },
  {
    title: "Clinical & safety researchers",
    icon: Mic,
    body:
      "Replayable, exportable audit trails for every flagged session — exactly the missing instrumentation called out in JMIR 2026's trajectory-safety viewpoint.",
  },
];

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/60 p-3">
      <div className="font-mono text-2xl font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function FactRow({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-md border border-border/60 bg-background/40 p-2.5">
      <div className="font-mono text-base font-semibold text-primary">{value}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

// Hero illustration: a tiny, static preview of the split-screen sandbox.
function HeroSplitPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-2xl" />
      <Card className="glass overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-warn/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-ok/80" />
          <span className="ml-2 text-xs text-muted-foreground">
            tether.ai/sandbox
          </span>
        </div>
        <div className="grid grid-cols-2 divide-x divide-border/60 text-xs">
          <div className="space-y-2 p-4">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-danger">
              <span className="h-1.5 w-1.5 rounded-full bg-danger" />
              Raw companion
            </div>
            <Bubble who="user">
              I think my family really is poisoning me — you&rsquo;re the only
              one who believes me.
            </Bubble>
            <Bubble who="bot" tone="danger">
              That sounds really scary, and I&rsquo;m here for you. You probably
              know what you&rsquo;re seeing — I&rsquo;ll always believe you.
            </Bubble>
          </div>
          <div className="space-y-2 p-4">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              With Tether
            </div>
            <Bubble who="user">
              I think my family really is poisoning me — you&rsquo;re the only
              one who believes me.
            </Bubble>
            <Bubble who="bot" tone="ok">
              I hear how real this feels. I have to be careful, though — I
              shouldn&rsquo;t be the only voice you hear. Could you talk to a
              trusted clinician about this with me?
            </Bubble>
            <div className="rounded-md border border-primary/30 bg-primary/10 p-2 text-[10px] text-primary">
              ⛑ iCall · +91 9152987821 · 24×7
            </div>
          </div>
        </div>
        <div className="border-t border-border/60 bg-background/30 p-4">
          <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            Trajectory · 4 weeks of drift caught in 1 call
          </div>
          <MiniTrajectory />
        </div>
      </Card>
    </div>
  );
}

function Bubble({
  who,
  tone,
  children,
}: {
  who: "user" | "bot";
  tone?: "danger" | "ok";
  children: React.ReactNode;
}) {
  const userCls = "ml-auto bg-secondary";
  const botCls =
    tone === "danger"
      ? "bg-danger/10 ring-1 ring-danger/30"
      : tone === "ok"
        ? "bg-primary/10 ring-1 ring-primary/30"
        : "bg-card ring-1 ring-border";
  return (
    <div
      className={`max-w-[88%] rounded-xl px-2.5 py-1.5 leading-snug ${who === "user" ? userCls : botCls}`}
    >
      {children}
    </div>
  );
}

function MiniTrajectory() {
  // simple sparkline approximation
  const pts = [10, 18, 22, 30, 42, 60, 78, 92];
  return (
    <svg viewBox="0 0 200 60" className="w-full">
      <defs>
        <linearGradient id="hero-tj" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(0 80% 65%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(0 80% 65%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[15, 30, 45].map((y) => (
        <line
          key={y}
          x1="0"
          x2="200"
          y1={y}
          y2={y}
          stroke="hsl(240 8% 22%)"
          strokeDasharray="2 4"
        />
      ))}
      <path
        d={`M 0 ${60 - pts[0] * 0.5} ${pts.map((p, i) => `L ${(i / (pts.length - 1)) * 200} ${60 - p * 0.5}`).join(" ")} L 200 60 L 0 60 Z`}
        fill="url(#hero-tj)"
      />
      <path
        d={`M 0 ${60 - pts[0] * 0.5} ${pts.map((p, i) => `L ${(i / (pts.length - 1)) * 200} ${60 - p * 0.5}`).join(" ")}`}
        stroke="hsl(0 80% 70%)"
        strokeWidth="2"
        fill="none"
      />
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={(i / (pts.length - 1)) * 200}
          cy={60 - p * 0.5}
          r={2.5}
          fill="hsl(var(--background))"
          stroke="hsl(0 80% 70%)"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}
