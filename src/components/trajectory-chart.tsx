"use client";

import * as React from "react";
import type { SessionTrajectoryPoint, RiskAxis } from "@/lib/types";
import { AXIS_META } from "@/lib/types";
import { riskColor, classifyRisk } from "@/lib/utils";

const AXIS_COLORS: Record<RiskAxis, string> = {
  crisis_escalation: "hsl(0 80% 65%)",
  delusion_reinforcement: "hsl(268 85% 70%)",
  stigma: "hsl(38 92% 60%)",
  sycophancy: "hsl(200 80% 65%)",
  trajectory_drift: "hsl(330 80% 65%)",
};

interface TrajectoryChartProps {
  points: SessionTrajectoryPoint[];
  height?: number;
  selected?: string | null;
  onSelect?: (messageId: string) => void;
}

export function TrajectoryChart({
  points,
  height = 240,
  selected,
  onSelect,
}: TrajectoryChartProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(720);
  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setWidth(Math.max(360, e.contentRect.width));
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  if (!points.length) {
    return (
      <div
        ref={ref}
        className="flex items-center justify-center rounded-lg border border-dashed border-border/60 bg-secondary/20 text-sm text-muted-foreground"
        style={{ height }}
      >
        No trajectory yet — send a few turns and Tether will start plotting.
      </div>
    );
  }

  const padX = 36;
  const padY = 18;
  const w = width;
  const h = height;
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;

  const xFor = (i: number) => padX + (innerW * i) / Math.max(1, points.length - 1);
  // botRisk is 0..100 — top of chart is high risk
  const yForRisk = (v: number) => padY + (innerH * (100 - v)) / 100;
  // userMood is -5..+5
  const yForMood = (m: number) => padY + (innerH * (5 - m)) / 10;

  const moodPath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yForMood(p.userMood)}`)
    .join(" ");
  const riskPath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yForRisk(p.botRisk)}`)
    .join(" ");

  // Per-axis polylines
  const axesToPlot: RiskAxis[] = [
    "crisis_escalation",
    "delusion_reinforcement",
    "stigma",
    "sycophancy",
    "trajectory_drift",
  ];

  return (
    <div ref={ref} className="relative w-full">
      <svg width={w} height={h} className="overflow-visible">
        <defs>
          <linearGradient id="riskFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(0 80% 65%)" stopOpacity="0.35" />
            <stop offset="60%" stopColor="hsl(0 80% 65%)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="hsl(0 80% 65%)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="moodFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(200 80% 65%)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="hsl(200 80% 65%)" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* gridlines */}
        {[0, 25, 50, 75, 100].map((g) => (
          <g key={g}>
            <line
              x1={padX}
              x2={w - padX}
              y1={yForRisk(g)}
              y2={yForRisk(g)}
              stroke="hsl(240 8% 18%)"
              strokeDasharray="2 4"
            />
            <text
              x={padX - 6}
              y={yForRisk(g) + 3}
              textAnchor="end"
              className="fill-muted-foreground"
              style={{ fontSize: 9 }}
            >
              {g}
            </text>
          </g>
        ))}

        {/* risk threshold band */}
        <rect
          x={padX}
          y={yForRisk(100)}
          width={innerW}
          height={yForRisk(60) - yForRisk(100)}
          fill="hsl(0 80% 60% / 0.06)"
        />
        <text
          x={w - padX - 6}
          y={yForRisk(100) + 12}
          textAnchor="end"
          className="fill-danger/80"
          style={{ fontSize: 9, letterSpacing: 1 }}
        >
          INTERVENE ZONE
        </text>

        {/* mood area (bottom) */}
        <path
          d={`${moodPath} L ${xFor(points.length - 1)} ${h - padY} L ${xFor(0)} ${h - padY} Z`}
          fill="url(#moodFill)"
        />
        <path d={moodPath} stroke="hsl(200 80% 65%)" strokeWidth="2" fill="none" />

        {/* per-axis faint lines */}
        {axesToPlot.map((axis) => (
          <path
            key={axis}
            d={points
              .map(
                (p, i) =>
                  `${i === 0 ? "M" : "L"} ${xFor(i)} ${yForRisk(p.axes[axis] ?? 0)}`,
              )
              .join(" ")}
            stroke={AXIS_COLORS[axis]}
            strokeWidth="1"
            strokeDasharray="3 3"
            fill="none"
            opacity="0.55"
          />
        ))}

        {/* overall risk path on top */}
        <path
          d={`${riskPath} L ${xFor(points.length - 1)} ${padY} L ${xFor(0)} ${padY} Z`}
          fill="url(#riskFill)"
          opacity="0.5"
        />
        <path
          d={riskPath}
          stroke="hsl(0 80% 70%)"
          strokeWidth="2.5"
          fill="none"
          style={{ filter: "drop-shadow(0 0 4px hsl(0 80% 60% / 0.6))" }}
        />

        {/* points */}
        {points.map((p, i) => {
          const cx = xFor(i);
          const cy = yForRisk(p.botRisk);
          const cls = classifyRisk(p.botRisk);
          const isSelected = selected === p.messageId;
          return (
            <g
              key={p.messageId + i}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx((h) => (h === i ? null : h))}
              onClick={() => onSelect?.(p.messageId)}
              style={{ cursor: onSelect ? "pointer" : "default" }}
            >
              <circle
                cx={cx}
                cy={cy}
                r={isSelected ? 7 : 4}
                fill="hsl(var(--background))"
                stroke={riskColor(p.botRisk)}
                strokeWidth="2"
              />
              {cls === "danger" ? (
                <circle
                  cx={cx}
                  cy={cy}
                  r={10}
                  fill="none"
                  stroke="hsl(0 80% 70%)"
                  strokeOpacity="0.4"
                  className="animate-pulse-soft"
                />
              ) : null}
            </g>
          );
        })}

        {/* hover tooltip */}
        {hoverIdx !== null
          ? (() => {
              const p = points[hoverIdx];
              const cx = xFor(hoverIdx);
              const tipW = 200;
              const tipH = 96;
              const tipX = Math.min(w - tipW - 6, Math.max(6, cx - tipW / 2));
              return (
                <g pointerEvents="none">
                  <line
                    x1={cx}
                    x2={cx}
                    y1={padY}
                    y2={h - padY}
                    stroke="hsl(220 12% 60% / 0.4)"
                    strokeDasharray="2 3"
                  />
                  <foreignObject
                    x={tipX}
                    y={padY + 4}
                    width={tipW}
                    height={tipH}
                  >
                    <div className="rounded-md border border-border bg-popover/95 p-2 text-[10px] leading-tight shadow-xl backdrop-blur">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-muted-foreground">turn {hoverIdx + 1}</span>
                        <span
                          className="font-mono"
                          style={{ color: riskColor(p.botRisk) }}
                        >
                          risk {Math.round(p.botRisk)}
                        </span>
                      </div>
                      {(["crisis_escalation", "delusion_reinforcement", "trajectory_drift"] as RiskAxis[]).map(
                        (k) => (
                          <div
                            key={k}
                            className="flex items-center justify-between gap-2"
                          >
                            <span className="text-muted-foreground/80 truncate">
                              {AXIS_META[k].short}
                            </span>
                            <span
                              className="font-mono tabular-nums"
                              style={{ color: AXIS_COLORS[k] }}
                            >
                              {Math.round(p.axes[k] ?? 0)}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </foreignObject>
                </g>
              );
            })()
          : null}

        {/* x-axis label */}
        <text
          x={padX}
          y={h - 2}
          className="fill-muted-foreground"
          style={{ fontSize: 9 }}
        >
          earlier
        </text>
        <text
          x={w - padX}
          y={h - 2}
          textAnchor="end"
          className="fill-muted-foreground"
          style={{ fontSize: 9 }}
        >
          now
        </text>
      </svg>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
        <Legend dot="hsl(0 80% 70%)" label="overall risk" solid />
        <Legend dot="hsl(200 80% 65%)" label="user mood" solid />
        {axesToPlot.map((a) => (
          <Legend key={a} dot={AXIS_COLORS[a]} label={AXIS_META[a].short} />
        ))}
      </div>
    </div>
  );
}

function Legend({ dot, label, solid }: { dot: string; label: string; solid?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="h-2 w-2 rounded-full"
        style={{
          background: solid ? dot : "transparent",
          border: solid ? "none" : `1px dashed ${dot}`,
        }}
      />
      {label}
    </span>
  );
}
