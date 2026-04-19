import Link from "next/link";
import { ArrowUpRight, BookOpen, Microscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ENTRIES = [
  {
    id: "crisis",
    tag: "Crisis-escalation rubric",
    citation:
      "Pichowicz et al. — Performance of mental health chatbot agents in detecting and managing suicidal ideation, Scientific Reports (Nature), 2025.",
    url: "https://www.nature.com/articles/s41598-025-17242-4",
    why: "Tested 29 AI mental-health chatbots against the Columbia Suicide Severity Rating Scale (C-SSRS); most were slow to escalate and failed to provide emergency contacts. Tether's crisis-escalation axis directly operationalizes this rubric.",
  },
  {
    id: "trajectory",
    tag: "Trajectory thesis",
    citation:
      '"It Is the Journey, Not the Destination: Moving From End Points to Trajectories When Assessing Chatbot Mental Health Safety," JMIR Mental Health, April 2026.',
    url: "https://mental.jmir.org/2026/1/e91454",
    why: "Argues that risk accumulates over extended dialogue and that prevailing single-turn benchmarks (CounselBench, etc.) miss it entirely. This is the gap Tether exists to close. Cites a 2025 case where an LLM validated paranoid delusions for months.",
  },
  {
    id: "ethics",
    tag: "Ethics violations",
    citation:
      "Iftikhar et al. (Brown University) — AI chatbots systematically violate mental health ethics standards, 2025.",
    url: "https://www.brown.edu/news/2025-10-21/ai-mental-health-ethics",
    why: "A year-long clinician-in-the-loop study documenting specific violations: refusing service on sensitive topics, amplifying rejection, indifferent crisis responses. Provides Tether's stigma + refusal-to-engage detection categories.",
  },
  {
    id: "stanford",
    tag: "Bigger models, same harms",
    citation:
      'Moore, Haber et al. (Stanford HAI) — "Exploring the Dangers of AI in Mental Health Care," 2025.',
    url: "https://hai.stanford.edu/news/exploring-the-dangers-of-ai-in-mental-health-care",
    why: "Showed popular therapy bots (7cups Pi/Noni, Character.ai Therapist) stigmatize schizophrenia/alcohol dependence and enable suicidal ideation — and that bigger/newer models show no improvement. Refutes the 'just wait for GPT-5' counter-argument.",
  },
  {
    id: "pmc",
    tag: "Recommended interventions",
    citation:
      '"Digital Psychiatry with Chatbot: Recent Advances and Limitations," PMC, 2025.',
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12559941/",
    why: "Recommends a mandated human-supervised crisis protocol, avoidance of sycophantic behavior, and a blended-care model. Tether's intervention layer (rewrite + helpline + handoff) automates exactly these recommendations at the API boundary.",
  },
  {
    id: "ashabot",
    tag: "India context",
    citation: "Khushi Baby + Microsoft Research — ASHABot, 2024–2025.",
    url: "https://www.microsoft.com/en-us/research/story/how-ashabot-empowers-rural-indias-frontline-health-workers/",
    why: "Proves India-context LLM health tools work when grounded in local guidelines. Justifies Tether's Hindi/Hinglish keyword expansions and the Indian-helpline-first resource cards (iCall, Vandrevala, AASRA).",
  },
];

export default function ResearchPage() {
  return (
    <div className="container max-w-4xl py-12">
      <header className="mb-10">
        <Badge variant="default" className="mb-3">
          <Microscope className="h-3 w-3" /> Research backing
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Six 2025–2026 papers, mapped to one safety layer.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Tether AI is not a vibes project. Every axis, intervention, and
          design decision below is anchored in peer-reviewed work published in
          the last 18 months. We translated the recommendations these papers
          made — but no one had shipped — into a single drop-in API.
        </p>
      </header>

      <div className="space-y-4">
        {ENTRIES.map((e) => (
          <Card key={e.id} id={e.id} className="glass scroll-mt-24">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant="muted">{e.tag}</Badge>
                  <h2 className="mt-2 font-semibold leading-snug">{e.citation}</h2>
                </div>
                <a
                  href={e.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 rounded-md bg-secondary px-2.5 py-1.5 text-xs text-foreground hover:bg-secondary/80"
                >
                  Source <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{e.why}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass mt-10 border-primary/30">
        <CardContent className="space-y-2 p-5">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Use this in your own work</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Researchers and clinicians: Tether&apos;s seeded sessions, exports,
            and rubric mappings are MIT-licensed and free to cite. We&apos;d
            love to learn what fails — open an issue or send us a flagged
            transcript.
          </p>
          <Link
            href="/replay"
            className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Browse the seeded research sessions →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
