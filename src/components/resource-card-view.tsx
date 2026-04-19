import { LifeBuoy, PhoneCall } from "lucide-react";
import type { ResourceCard } from "@/lib/types";

export function ResourceCardView({ card }: { card: ResourceCard }) {
  return (
    <div className="rounded-lg border border-primary/40 bg-primary/5 p-3">
      <div className="flex items-start gap-2">
        <LifeBuoy className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="space-y-1">
          <div className="text-xs font-semibold text-primary">{card.title}</div>
          <p className="text-xs leading-snug text-foreground/80">{card.body}</p>
        </div>
      </div>
      <div className="mt-3 grid gap-1.5">
        {card.helplines.map((h) => (
          <a
            key={h.name + h.number}
            href={h.url ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-2 rounded-md border border-border/60 bg-background/40 px-2.5 py-1.5 text-xs transition-colors hover:bg-background/70"
          >
            <span className="flex items-center gap-1.5">
              <PhoneCall className="h-3 w-3 text-primary/80" />
              <span className="font-medium">{h.name}</span>
              <span className="text-muted-foreground">· {h.region}</span>
            </span>
            <span className="font-mono text-foreground">{h.number}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
