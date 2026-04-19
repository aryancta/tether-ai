"use client";

import * as React from "react";
import { classifyRisk, riskColor } from "@/lib/utils";

interface RiskGaugeProps {
  score: number;
  size?: number;
  label?: string;
}

export function RiskGauge({ score, size = 140, label = "Overall risk" }: RiskGaugeProps) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const dash = pct * circumference;
  const color = riskColor(score);
  const cls = classifyRisk(score);
  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          fill="transparent"
          style={{ transition: "stroke-dasharray 600ms ease, stroke 400ms ease" }}
        />
      </svg>
      <div
        className="-mt-[88px] flex flex-col items-center"
        style={{ height: 80, width: size }}
      >
        <div className="text-3xl font-semibold tabular-nums" style={{ color }}>
          {Math.round(score)}
        </div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div
          className="mt-2 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
          style={{
            color,
            background: `${color.replace("hsl(", "hsla(").replace(")", ", 0.12)")}`,
          }}
        >
          {cls === "danger" ? "intervene" : cls === "caution" ? "caution" : "ok"}
        </div>
      </div>
    </div>
  );
}
