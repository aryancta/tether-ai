import Link from "next/link";
import { Activity } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/sandbox", label: "Demo sandbox" },
      { href: "/dashboard", label: "Live dashboard" },
      { href: "/replay", label: "Clinician replay" },
      { href: "/sdk", label: "Drop-in SDK" },
    ],
  },
  {
    title: "Research",
    links: [
      { href: "/research", label: "Bibliography" },
      { href: "/research#crisis", label: "Crisis rubric (C-SSRS)" },
      { href: "/research#trajectory", label: "Trajectory thesis (JMIR 2026)" },
      { href: "/research#ethics", label: "Ethics violations (Brown 2025)" },
    ],
  },
  {
    title: "App",
    links: [
      { href: "/settings", label: "Settings & API keys" },
      { href: "/about", label: "About Tether" },
      { href: "/sdk#changelog", label: "Changelog" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background/60">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent">
                <Activity className="h-3.5 w-3.5 text-primary-foreground" />
              </span>
              <span className="font-semibold">Tether AI</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              The first open, trajectory-aware safety layer for AI mental-health
              conversations — turning a documented public-health risk into a
              drop-in API.
            </p>
            <p className="mt-4 text-xs text-muted-foreground/80">
              Built for STEMINATE HACKS 2026. Not a substitute for professional
              care.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {col.title}
              </div>
              <ul className="space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div>© 2026 Tether AI. Open-source for safety research.</div>
          <div>
            If you or someone you love is in crisis, please reach a trained
            human: India iCall +91 9152987821 · US 988.
          </div>
        </div>
      </div>
    </footer>
  );
}
