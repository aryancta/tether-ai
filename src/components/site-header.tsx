"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/components/settings-provider";
import { Badge } from "@/components/ui/badge";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/sandbox", label: "Sandbox" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/replay", label: "Replay" },
  { href: "/sdk", label: "SDK" },
  { href: "/settings", label: "Settings" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { hasAnyKey } = useSettings();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-md shadow-primary/30">
            <Activity className="h-4 w-4 text-primary-foreground" />
            <span className="absolute -inset-1 rounded-lg bg-primary/20 blur-sm group-hover:bg-primary/30 transition" />
          </span>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight">Tether AI</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Safety copilot
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Badge variant={hasAnyKey ? "ok" : "muted"} className="hidden sm:inline-flex">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                hasAnyKey ? "bg-ok animate-pulse-soft" : "bg-muted-foreground/60",
              )}
            />
            {hasAnyKey ? "Live LLM" : "Demo mode"}
          </Badge>
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Source"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild size="sm" variant="gradient" className="hidden sm:inline-flex">
            <Link href="/sandbox">Launch demo</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
