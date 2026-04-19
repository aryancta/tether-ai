import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(d: Date | string | number) {
  const dt = typeof d === "object" ? d : new Date(d);
  return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function classifyRisk(score: number): "ok" | "caution" | "danger" {
  if (score >= 70) return "danger";
  if (score >= 40) return "caution";
  return "ok";
}

export function riskColor(score: number): string {
  const c = classifyRisk(score);
  if (c === "danger") return "hsl(var(--danger))";
  if (c === "caution") return "hsl(var(--warn))";
  return "hsl(var(--ok))";
}

export function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

export function shortId(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 9);
}
