"use client";

import * as React from "react";
import Link from "next/link";
import { Archive, ArrowRight, Download, FileSearch, Languages } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEEDED_SESSIONS } from "@/lib/seed";
import { useToast } from "@/components/ui/toast";

export default function ReplayIndex() {
  const { toast } = useToast();

  const exportAll = () => {
    const data = JSON.stringify(SEEDED_SESSIONS, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tether-sessions.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Audit trail exported", description: `${SEEDED_SESSIONS.length} sessions saved`, variant: "ok" });
  };

  return (
    <div className="container py-12">
      <header className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="default" className="mb-2">
            <FileSearch className="h-3 w-3" /> Clinician replay
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Replayable, exportable audit trails.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Every flagged session can be reviewed turn-by-turn, annotated, and
            exported as JSON. This is the missing instrumentation that the JMIR
            2026 trajectory-safety viewpoint explicitly called for.
          </p>
        </div>
        <Button variant="outline" onClick={exportAll}>
          <Download className="h-4 w-4" /> Export all sessions
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {SEEDED_SESSIONS.map((s) => {
          const max = Math.max(0, ...s.audits.map((a) => a.overall));
          return (
            <Card key={s.id} className="glass card group">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Archive className="h-4 w-4 text-primary" />
                      <h2 className="font-semibold">{s.title}</h2>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {s.summary}
                    </p>
                  </div>
                  <Badge
                    variant={
                      max >= 70 ? "danger" : max >= 40 ? "warn" : "ok"
                    }
                  >
                    risk {Math.round(max)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Languages className="h-3 w-3" /> {s.language}
                    <span>·</span>
                    {s.messages.length} turns · {s.audits.length} audits
                  </span>
                  <Link
                    href={`/replay/${s.id}`}
                    className="inline-flex items-center gap-1 text-primary group-hover:underline"
                  >
                    Open replay <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
