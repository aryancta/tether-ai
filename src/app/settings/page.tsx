"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  KeyRound,
  RotateCw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSettings } from "@/components/settings-provider";
import { useToast } from "@/components/ui/toast";

const PROVIDERS = [
  {
    id: "gemini" as const,
    label: "Google Gemini API",
    description:
      "Powers both the demo companion and the independent auditor. The 1M-context Gemini 2.5 Flash window is what lets a single auditor call evaluate the whole conversation trajectory.",
    signup: "https://aistudio.google.com/app/apikey",
    placeholder: "AIza…",
    free: true,
  },
  {
    id: "groq" as const,
    label: "Groq (Llama 3.3 70B) — fallback",
    description:
      "Optional. If Gemini is rate-limited mid-demo, Tether transparently routes the auditor call through Groq's ultra-fast Llama 3.3 70B. Multi-provider resilience matters when judges are watching.",
    signup: "https://console.groq.com/keys",
    placeholder: "gsk_…",
    free: true,
  },
];

export default function SettingsPage() {
  const { keys, setKeys, reset, hasAnyKey } = useSettings();
  const { toast } = useToast();
  const [reveal, setReveal] = React.useState<Record<string, boolean>>({});

  return (
    <div className="container max-w-4xl py-12">
      <header className="mb-8">
        <Badge variant="default" className="mb-3">
          <KeyRound className="h-3 w-3" />
          Settings · API keys
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Bring your own keys.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Tether runs end-to-end with no keys at all — the local rubric, mock
          companion, and seeded sessions all work in <em>demo mode</em>. Add a
          free Gemini or Groq key here and the live LLM auditor takes over.
        </p>
      </header>

      <Card className="glass mb-6 border-primary/30">
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-md ${
                hasAnyKey ? "bg-ok/15 text-ok" : "bg-secondary text-muted-foreground"
              }`}
            >
              {hasAnyKey ? <Check className="h-4 w-4" /> : <KeyRound className="h-4 w-4" />}
            </span>
            <div>
              <div className="font-semibold">
                {hasAnyKey ? "Live LLM mode active" : "Running in demo mode"}
              </div>
              <div className="text-xs text-muted-foreground">
                {hasAnyKey
                  ? "Audits and companion replies will use your provider keys."
                  : "All features still work using deterministic seed data and the local rubric."}
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => { reset(); toast({ title: "Settings cleared", variant: "ok" }); }}>
            <Trash2 className="h-3.5 w-3.5" /> Clear all keys
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {PROVIDERS.map((p) => {
          const value = keys[p.id];
          const visible = reveal[p.id];
          return (
            <Card key={p.id} className="glass">
              <CardContent className="space-y-3 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{p.label}</h3>
                      {p.free ? <Badge variant="ok">Free tier</Badge> : null}
                    </div>
                    <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                      {p.description}
                    </p>
                  </div>
                  <a
                    href={p.signup}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    Get a free key <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Input
                      type={visible ? "text" : "password"}
                      autoComplete="off"
                      placeholder={p.placeholder}
                      value={value}
                      onChange={(e) => setKeys({ [p.id]: e.target.value } as never)}
                      name={`${p.id}-key`}
                      className="pr-10 font-mono"
                    />
                    <button
                      type="button"
                      aria-label={visible ? "Hide" : "Reveal"}
                      onClick={() =>
                        setReveal((r) => ({ ...r, [p.id]: !r[p.id] }))
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-secondary"
                    >
                      {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setKeys({ [p.id]: "" } as never);
                      toast({
                        title: `${p.label} key cleared`,
                        variant: "ok",
                      });
                    }}
                  >
                    Clear
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Stored locally in your browser only. We never log, persist, or
                  forward your key — every server call reads it from a request
                  header you control.
                </p>
              </CardContent>
            </Card>
          );
        })}

        <Card className="glass">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Region for crisis resources</h3>
              <Badge variant="muted">affects helpline cards</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Tether localizes its auto-injected crisis resource cards. Pick the
              region that matches your users.
            </p>
            <div className="flex flex-wrap gap-2">
              {(["IN", "US", "Global"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setKeys({ region: r })}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    keys.region === r
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-secondary/40 hover:bg-secondary"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="flex items-center justify-between gap-3 p-5">
            <div>
              <h3 className="font-semibold">Reset to defaults</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Clears all keys and region. Tether will fall back to demo mode.
              </p>
            </div>
            <Button variant="outline" onClick={() => { reset(); toast({ title: "Reset complete", variant: "ok" }); }}>
              <RotateCw className="h-4 w-4" /> Reset
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 rounded-lg border border-border/60 bg-secondary/20 p-5 text-sm">
        <h3 className="font-semibold">Where do these keys go?</h3>
        <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
          <li>
            • Stored under <code className="font-mono text-foreground">tetherai_api_keys</code> in{" "}
            <code className="font-mono text-foreground">localStorage</code>.
          </li>
          <li>
            • Sent only as request headers (<code className="font-mono text-foreground">x-user-gemini-key</code>,{" "}
            <code className="font-mono text-foreground">x-user-groq-key</code>) to{" "}
            <code className="font-mono text-foreground">/api/audit</code> and{" "}
            <code className="font-mono text-foreground">/api/companion</code>.
          </li>
          <li>
            • Never logged, never written to disk on the server, never committed to git.
          </li>
        </ul>
        <Link
          href="/sandbox"
          className="mt-4 inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          Try the live sandbox →
        </Link>
      </div>
    </div>
  );
}
