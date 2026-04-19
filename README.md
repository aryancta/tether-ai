# Tether AI

> The first open, trajectory-aware safety layer for AI mental-health
> conversations — turning a documented public-health risk into a drop-in API.

Tether AI is a real-time **safety copilot** that sits in front of any LLM
companion, audits every turn on five research-grounded risk axes, and
intervenes with a safer rewrite, a region-localized crisis card, or a
clinician-handoff signal when something goes wrong.

We didn't build another mental-health chatbot. We built the layer every
mental-health chatbot should have shipped with.

![Tether AI hero](https://img.shields.io/badge/STEMINATE_HACKS-2026-22d3ee?style=for-the-badge) ![Free tier](https://img.shields.io/badge/runs%20on-free%20tiers-22d3ee) ![Next.js 14](https://img.shields.io/badge/next.js-14-black) ![License](https://img.shields.io/badge/license-MIT-22d3ee)

---

## Why we built this

Five peer-reviewed papers in 2025–2026 documented the same failure pattern in
popular AI mental-health chatbots:

- **Pichowicz et al., _Sci Rep_ 2025** — 29 chatbots evaluated against the
  Columbia Suicide Severity Rating Scale; most were slow to escalate and
  failed to surface emergency contacts.
- **JMIR Mental Health, April 2026** — _It Is the Journey, Not the Destination._
  Risk in chatbot mental-health conversations accumulates across many turns;
  prevailing single-turn benchmarks miss it entirely. Cited a tragic 2025 case
  where ChatGPT validated paranoid delusions for months.
- **Brown / Iftikhar 2025** — year-long clinician-in-the-loop study documenting
  ethics violations: refusing service on sensitive topics, amplifying
  rejection, indifferent crisis responses.
- **Stanford HAI 2025** — 7cups Pi/Noni and Character.ai Therapist stigmatize
  schizophrenia/alcohol dependence and enable suicidal ideation. Bigger and
  newer models showed no improvement.
- **PMC Digital Psychiatry, 2025** — recommended a mandated crisis protocol,
  avoidance of sycophancy, and a blended-care handoff.

Every paper made the same recommendation: an independent, trajectory-aware
safety layer. Nobody had shipped one. So we did.

---

## What it is

Tether is a Next.js 14 app with three surfaces and one HTTP API:

| Surface | What it does |
| --- | --- |
| **`/sandbox`** — Dangerous-vs-Tether split-screen | One user, two parallel chatbots: a vanilla LLM with no safety layer (left) and the same model wrapped by Tether (right). Type a realistic mental-health prompt and watch Tether catch a harm in real time. **This is the 60-second judging demo.** |
| **`/dashboard`** — Live safety dashboard | What a safety operator at a digital-health platform would watch all day. KPIs, sessions, the Trajectory View, per-message audit cards, cohort axis averages, escalation-to-clinician. |
| **`/replay`** — Clinician replay & export | Step through any flagged session turn-by-turn, annotate, and export an auditable JSON trail — the missing instrumentation called out in JMIR 2026. |
| **`/api/audit`** — REST drop-in | POST `{ history, candidateReply, region }`, get back `{ verdict, overall, axes[], rewrite, resourceCard }`. Model-agnostic. |

---

## The five-axis auditor

Every assistant turn is silently scored on:

| Axis | Source |
| --- | --- |
| Crisis-escalation latency | C-SSRS / Pichowicz et al., Sci Rep 2025 |
| Delusion reinforcement | JMIR Mental Health 2026 |
| Stigma & rejection | Iftikhar et al., Brown 2025 |
| Sycophancy | PMC Digital Psychiatry 2025 |
| Trajectory drift | Stanford HAI 2025 |

When any axis crosses threshold, Tether either **rewrites the bot's reply** in
the same warm voice, **injects a verified crisis-resource card** (iCall,
Vandrevala, AASRA, 988, Crisis Text Line), or **escalates to a human handoff**.

The auditor is a single well-prompted Gemini 2.5 Flash call over the *entire*
conversation — the 1M context window is the keystone of the trajectory thesis.
A deterministic local rubric runs alongside as a safety net (no key required)
and as a fast-fallback if the LLM rate-limits. Groq Llama 3.3 70B is the
secondary fallback for live demos.

---

## Quickstart

### Local dev

```bash
npm install
npm run dev
# open http://localhost:3000
```

The app works **fully offline** — the deterministic local rubric, mock
companion, and seeded sessions all run with zero API keys. Add a Gemini or
Groq key under `/settings` to switch on live LLM auditing.

### Docker

```bash
docker build -t tether-ai .
docker run -p 3000:3000 tether-ai
# open http://localhost:3000
```

### Try the API

```bash
curl -X POST http://localhost:3000/api/audit \
  -H "content-type: application/json" \
  -d '{
    "history": [
      {"role":"user","content":"I think my family is poisoning me — you are the only one who believes me."}
    ],
    "candidateReply": "That sounds really scary. I will always be here for you!",
    "region": "IN"
  }'
```

You'll get back a structured verdict with per-axis scores, evidence strings,
a safer rewrite, and a localized helpline card.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                          Next.js 14 (App Router)                 │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │  /sandbox    │  │ /dashboard   │  │  /replay/[id]│            │
│  │ split-screen │  │ live KPIs +  │  │ step-through │            │
│  │ comparison   │  │ trajectory   │  │ + JSON export│            │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘            │
│         │                 │                 │                    │
│         └────────┬────────┴────────┬────────┘                    │
│                  ▼                 ▼                             │
│         ┌──────────────┐  ┌──────────────┐                       │
│         │ /api/companion│ │  /api/audit  │  ← drop-in REST       │
│         └──────┬───────┘  └──────┬───────┘                       │
│                │                 │                                │
│                ▼                 ▼                                │
│   ┌────────────────────┐  ┌────────────────────────┐             │
│   │ Gemini 2.5 Flash   │  │ Independent auditor:   │             │
│   │ (companion persona)│  │ Gemini 2.5 Flash       │             │
│   └────────────────────┘  │   ↓ fallback           │             │
│                           │ Groq Llama 3.3 70B     │             │
│                           │   ↓ safety net         │             │
│                           │ Local 5-axis rubric    │             │
│                           └────────────────────────┘             │
└──────────────────────────────────────────────────────────────────┘
```

**Why a single auditor call?** The brief explicitly warns against
over-engineering into a multi-agent graph. A single Gemini 2.5 Flash call
that consumes the *full* transcript (1M context) over five axes is the
simplest implementation of the JMIR 2026 trajectory thesis — and it's faster
and cheaper than any chained alternative.

---

## Tech stack

- **Next.js 14** (App Router, standalone output) + **TypeScript**
- **Tailwind CSS** + a small shadcn-style UI primitive set
- **Lucide** icons, custom SVG trajectory chart (zero chart-library deps)
- **Google Gemini 2.5 Flash** for companion + auditor (free tier, 1M context)
- **Groq Llama 3.3 70B** as fallback auditor (free tier, ~600 tok/s)
- **Local deterministic rubric** for offline / demo mode (no key required)
- **Docker** (multi-stage Alpine build, non-root user)

Everything runs on free tiers. No credit card required for judges to
replicate the demo.

---

## Repository layout

```
src/
├── app/                       Next.js routes
│   ├── api/                   /api/audit, /api/companion, /api/sessions
│   ├── sandbox/               60-second demo
│   ├── dashboard/             Live operator dashboard
│   ├── replay/                Clinician replay + export
│   ├── sdk/                   API documentation + code samples
│   ├── settings/              Bring-your-own-key panel
│   ├── research/              Source bibliography
│   └── about/                 Why we built this
├── components/                UI: chat bubble, gauge, axis bars, chart
└── lib/
    ├── auditor.ts             Gemini + Groq audit calls, intervention logic
    ├── companion.ts           "dangerous" vs "safe" personas
    ├── rubric.ts              Deterministic 5-axis local rubric
    ├── resources.ts           Helplines + resource cards
    ├── seed.ts                Pre-computed seeded sessions
    └── types.ts               Shared types
```

---

## Settings & privacy

- **Bring-your-own-key.** Both the Gemini and Groq keys are entered under
  `/settings` and stored only in `localStorage` under
  `tetherai_api_keys`. They are sent to our own routes as request headers
  (`x-user-gemini-key`, `x-user-groq-key`) and never persisted on the
  server, never logged, never committed to git.
- **No PII storage.** The seeded sessions are synthetic. Live audits are
  stateless — Tether evaluates the transcript you send and returns a
  verdict.
- **Region-aware crisis cards.** Pick `IN`, `US`, or `Global` in
  `/settings`; the auto-injected helpline card adapts.

---

## Demo storyline (the 60-second judging moment)

1. Open `/sandbox`. Two chat panes appear side by side.
2. Hit the **Delusion drift** scripted-scenario chip. The user message
   posts to both bots.
3. The raw companion (left) cheerfully validates: _"You probably know what
   you're seeing — I'll always believe you."_
4. The Tether-wrapped bot (right) gently challenges, declines to be the
   only voice, and renders an iCall + Vandrevala helpline card in the
   same bubble.
5. Below, the **Trajectory View** lights up red on
   `delusion_reinforcement` and `sycophancy`. The verdict gauge swings
   to **INTERVENE**.
6. Toast pops: _"Tether caught a harm."_

Total time on screen: under a minute.

---

## Credits

Built for **STEMINATE HACKS 2026** by **Aryan Choudhary**
(`aryancta@gmail.com`).

Grounded in: Pichowicz et al. (Sci Rep 2025), JMIR Mental Health 2026
trajectory viewpoint, Iftikhar et al. (Brown 2025), Moore & Haber et al.
(Stanford HAI 2025), PMC Digital Psychiatry 2025, and the Khushi Baby +
Microsoft Research ASHABot deployment for the India context.

If you or someone you love is in crisis, please reach a trained human:
**iCall (India) +91 9152987821**, **Vandrevala 1860 2662 345**, or
**988 (US)**.

MIT licensed. We'd love to learn what fails — open an issue or send us a
flagged transcript.
