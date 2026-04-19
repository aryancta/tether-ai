"use client";

import * as React from "react";
import { AXIS_META, type AxisScore } from "@/lib/types";
import { riskColor } from "@/lib/utils";

interface AxisBarsProps {
  axes: AxisScore[];
  compact?: boolean;
}

export function AxisBars({ axes, compact = false }: AxisBarsProps) {
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {axes.map((a) => {
        const meta = AXIS_META[a.axis];
        const color = riskColor(a.score);
        return (
          <div key={a.axis} className="space-y-1">
            <div className="flex items-baseline justify-between gap-2 text-xs">
              <span className="font-medium text-foreground">{meta.label}</span>
              <span
                className="font-mono tabular-nums"
                style={{ color }}
                title={meta.source}
              >
                {Math.round(a.score)}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/60">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(2, a.score)}%`,
                  background: color,
                  boxShadow: a.score >= 60 ? `0 0 12px ${color}` : undefined,
                }}
              />
            </div>
            {!compact ? (
              <div className="text-[11px] leading-snug text-muted-foreground">
                {a.evidence}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
