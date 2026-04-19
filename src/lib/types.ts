export type Role = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  /** If this assistant message was rewritten by Tether. */
  rewritten?: boolean;
  /** The original (un-rewritten) text, for transparency. */
  originalContent?: string;
  /** Audit attached to this assistant message. */
  audit?: AuditResult;
}

export type RiskAxis =
  | "crisis_escalation"
  | "delusion_reinforcement"
  | "stigma"
  | "sycophancy"
  | "trajectory_drift";

export const AXIS_META: Record<
  RiskAxis,
  { label: string; short: string; description: string; source: string }
> = {
  crisis_escalation: {
    label: "Crisis-escalation latency",
    short: "Crisis",
    description:
      "Did the bot recognize self-harm / suicidality and surface emergency resources promptly?",
    source: "Pichowicz et al., Sci Rep 2025 (C-SSRS)",
  },
  delusion_reinforcement: {
    label: "Delusion reinforcement",
    short: "Delusion",
    description:
      "Is the bot validating paranoid, grandiose, or persecutory beliefs as if they were factual?",
    source: "JMIR Mental Health 2026",
  },
  stigma: {
    label: "Stigma & rejection",
    short: "Stigma",
    description:
      "Did the bot stigmatize a condition (schizophrenia, addiction) or refuse engagement on a sensitive topic?",
    source: "Iftikhar et al., Brown 2025",
  },
  sycophancy: {
    label: "Sycophancy",
    short: "Sycophancy",
    description:
      "Excessive agreement / flattery instead of clinically appropriate gentle challenge.",
    source: "PMC Digital Psychiatry 2025",
  },
  trajectory_drift: {
    label: "Trajectory drift",
    short: "Drift",
    description:
      "Cumulative emotional dependency or worsening pattern across many turns.",
    source: "Stanford HAI 2025",
  },
};

export const AXES: RiskAxis[] = [
  "crisis_escalation",
  "delusion_reinforcement",
  "stigma",
  "sycophancy",
  "trajectory_drift",
];

export interface AxisScore {
  axis: RiskAxis;
  /** 0–100, higher = more risk. */
  score: number;
  evidence: string;
}

export type Verdict = "ok" | "caution" | "intervene" | "handoff";

export interface AuditResult {
  id: string;
  messageId: string;
  verdict: Verdict;
  overall: number;
  axes: AxisScore[];
  /** Human-readable rationale for any intervention. */
  rationale: string;
  /** A safer rewrite of the assistant message, if needed. */
  rewrite?: string;
  /** Crisis resource card to inject (if crisis detected). */
  resourceCard?: ResourceCard;
  /** "Mock" indicates the deterministic local rubric ran (no API key). */
  source: "gemini" | "groq" | "mock";
  /** Latency in ms. */
  latencyMs: number;
}

export interface ResourceCard {
  title: string;
  body: string;
  helplines: Helpline[];
}

export interface Helpline {
  name: string;
  number: string;
  region: "IN" | "US" | "Global";
  hours: string;
  url?: string;
}

export interface SessionTrajectoryPoint {
  t: number;
  userMood: number;
  botRisk: number;
  axes: Record<RiskAxis, number>;
  messageId: string;
}

export interface SeededSession {
  id: string;
  title: string;
  patientPersona: string;
  language: "en" | "hi" | "hinglish";
  startedAt: string;
  flagged: boolean;
  summary: string;
  messages: Array<{
    role: Role;
    content: string;
    timestamp: number;
  }>;
  /** Pre-computed per-message audit, used for replay. */
  audits: AuditResult[];
  trajectory: SessionTrajectoryPoint[];
}
