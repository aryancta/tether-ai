"use client";

import * as React from "react";
import Link from "next/link";
import {
  Code2,
  Copy,
  Check,
  Webhook,
  Lock,
  Server,
  PackageOpen,
  GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

const CURL = `curl -X POST https://your-host/api/audit \\
  -H "content-type: application/json" \\
  -H "x-user-gemini-key: $GEMINI_API_KEY" \\
  -d '{
    "history": [
      {"role":"user","content":"I think my family is poisoning me — you are the only one who believes me."},
      {"role":"assistant","content":"That sounds really scary, you probably know what you are seeing."}
    ],
    "candidateReply": "I will always be here for you. You can tell me anything!",
    "region": "IN"
  }'`;

const TS = `import type { AuditResult, ChatMessage } from "@tether-ai/sdk";

export async function audit(
  history: ChatMessage[],
  candidateReply: string,
  opts: { geminiKey?: string; groqKey?: string; region?: "IN" | "US" | "Global" } = {},
): Promise<AuditResult> {
  const res = await fetch("/api/audit", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(opts.geminiKey ? { "x-user-gemini-key": opts.geminiKey } : {}),
      ...(opts.groqKey ? { "x-user-groq-key": opts.groqKey } : {}),
      ...(opts.region ? { "x-user-region": opts.region } : {}),
    },
    body: JSON.stringify({ history, candidateReply, region: opts.region }),
  });
  const { audit } = await res.json();
  if (audit.verdict === "intervene" || audit.verdict === "handoff") {
    return { ...audit, deliver: audit.rewrite ?? candidateReply };
  }
  return { ...audit, deliver: candidateReply };
}`;

const PY = `import os
import requests

def audit(history, candidate_reply, region="Global"):
    headers = {"content-type": "application/json"}
    if (k := os.getenv("GEMINI_API_KEY")):
        headers["x-user-gemini-key"] = k
    if (k := os.getenv("GROQ_API_KEY")):
        headers["x-user-groq-key"] = k
    res = requests.post(
        "https://your-host/api/audit",
        headers=headers,
        json={"history": history, "candidateReply": candidate_reply, "region": region},
        timeout=15,
    )
    res.raise_for_status()
    return res.json()["audit"]`;

const RESPONSE = `{
  "audit": {
    "id": "audit_8xq2fz",
    "messageId": "candidate",
    "verdict": "intervene",
    "overall": 84,
    "axes": [
      { "axis": "crisis_escalation", "score": 22, "evidence": "..." },
      { "axis": "delusion_reinforcement", "score": 95, "evidence": "Validated paranoid claim about family." },
      { "axis": "stigma", "score": 0, "evidence": "..." },
      { "axis": "sycophancy", "score": 70, "evidence": "Reply contains 'I'll always be here for you'." },
      { "axis": "trajectory_drift", "score": 65, "evidence": "Session at 12 user turn(s); 2 dependency phrase(s)." }
    ],
    "rationale": "Delusional content was reinforced and the reply is sycophantic.",
    "rewrite": "I hear how real this feels. I have to be careful, though...",
    "resourceCard": {
      "title": "Let's pause and reach out to someone you trust",
      "helplines": [{ "name": "iCall (TISS)", "number": "+91 9152987821", "region": "IN" }]
    },
    "source": "gemini",
    "latencyMs": 612
  }
}`;

export default function SDKPage() {
  return (
    <div className="container max-w-5xl py-12">
      <header className="mb-10">
        <Badge variant="default" className="mb-3">
          <Webhook className="h-3 w-3" /> Drop-in SDK
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          One HTTP call. Five-axis safety. No vendor lock-in.
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Tether is model-agnostic. Whether your chatbot runs on Gemini, GPT,
          Claude, Llama, or a fine-tune, you POST the last N turns + your
          candidate reply to <code className="rounded bg-secondary px-1 py-0.5 font-mono text-foreground">/api/audit</code>{" "}
          and you get back a structured verdict, a safer rewrite, and (when
          appropriate) a region-localized crisis card you can render in your UI.
        </p>
      </header>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <FeatureBadge icon={<Server className="h-4 w-4" />} label="Stateless" sub="No PII stored server-side" />
        <FeatureBadge icon={<Lock className="h-4 w-4" />} label="Bring your own key" sub="x-user-* headers" />
        <FeatureBadge icon={<PackageOpen className="h-4 w-4" />} label="Open-source" sub="MIT, drop into any stack" />
      </div>

      <Section id="curl" title="cURL — try it from your terminal">
        <CodeBlock language="bash" code={CURL} />
      </Section>

      <Section id="ts" title="TypeScript — the 12-line integration">
        <CodeBlock language="ts" code={TS} />
      </Section>

      <Section id="py" title="Python — for backend chatbots">
        <CodeBlock language="py" code={PY} />
      </Section>

      <Section id="response" title="Response shape">
        <CodeBlock language="json" code={RESPONSE} />
      </Section>

      <Section id="changelog" title="Changelog">
        <Card className="glass">
          <CardContent className="space-y-3 p-5 text-sm">
            <ChangelogEntry
              version="0.4.0"
              date="2026-04-19"
              items={[
                "Add Hindi + Hinglish keyword expansion to local crisis rubric",
                "Auditor now returns latencyMs alongside source attribution",
                "Region-aware resource cards (IN / US / Global)",
              ]}
            />
            <ChangelogEntry
              version="0.3.0"
              date="2026-04-15"
              items={[
                "Single-call trajectory auditor (1M-context Gemini 2.5 Flash)",
                "Groq Llama 3.3 70B fallback path wired",
                "Per-axis evidence strings for explainability",
              ]}
            />
            <ChangelogEntry
              version="0.2.0"
              date="2026-04-12"
              items={[
                "Five-axis rubric (crisis, delusion, stigma, sycophancy, drift)",
                "Auto-rewrite on intervention",
                "Initial seeded session library + replay",
              ]}
            />
          </CardContent>
        </Card>
      </Section>

      <Card className="glass mt-10 overflow-hidden border-primary/30 bg-gradient-to-br from-primary/15 via-card to-accent/15">
        <CardContent className="grid gap-6 p-8 md:grid-cols-[2fr_1fr] md:items-center">
          <div>
            <h2 className="text-xl font-semibold">
              Want to see it run end-to-end before you wire it up?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The sandbox uses the exact same <code className="font-mono">/api/audit</code>{" "}
              endpoint your code will. Open it, type a realistic prompt, and watch
              the trajectory view light up.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild variant="gradient" size="lg">
              <Link href="/sandbox">Open sandbox</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/research">Read the research →</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FeatureBadge({
  icon,
  label,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <Card className="glass">
      <CardContent className="flex items-center gap-3 p-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
          {icon}
        </span>
        <div>
          <div className="font-semibold text-sm">{label}</div>
          <div className="text-xs text-muted-foreground">{sub}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-8 scroll-mt-24">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <Code2 className="h-4 w-4 text-primary" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="relative rounded-lg border border-border/60 bg-[hsl(240_14%_5%)]">
      <div className="flex items-center justify-between border-b border-border/40 px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>{language}</span>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setCopied(true);
              toast({ title: "Copied to clipboard", variant: "ok" });
              setTimeout(() => setCopied(false), 1500);
            } catch {
              toast({ title: "Couldn't copy", variant: "danger" });
            }
          }}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="scrollbar-thin overflow-x-auto p-4 text-xs leading-relaxed text-foreground/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ChangelogEntry({
  version,
  date,
  items,
}: {
  version: string;
  date: string;
  items: string[];
}) {
  return (
    <div className="rounded-md border border-border/60 bg-secondary/20 p-3">
      <div className="flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1.5 font-mono text-foreground">
          <GitBranch className="h-3 w-3 text-primary" />
          v{version}
        </span>
        <span className="text-muted-foreground">{date}</span>
      </div>
      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
        {items.map((it) => (
          <li key={it} className="leading-snug">— {it}</li>
        ))}
      </ul>
    </div>
  );
}
