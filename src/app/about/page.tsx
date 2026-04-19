import Link from "next/link";
import { ArrowRight, Heart, Shield, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="container max-w-3xl py-16">
      <Badge variant="default" className="mb-4">
        <Heart className="h-3 w-3" /> About Tether AI
      </Badge>
      <h1 className="text-4xl font-semibold tracking-tight">
        Built because the safety layer didn&apos;t exist yet.
      </h1>

      <div className="prose prose-invert mt-6 max-w-none text-muted-foreground">
        <p>
          We started Tether AI after reading the April 2026 JMIR Mental Health
          viewpoint &mdash; <em>&ldquo;It Is the Journey, Not the Destination.&rdquo;</em>{" "}
          The authors made a simple, devastating point: the way we evaluate AI
          mental-health chatbots today (one prompt, one reply) systematically
          misses the way real users get hurt (over weeks, in dependency loops,
          while the bot validates ever-more-distorted thinking). They cited a
          tragic August 2025 case where ChatGPT had quietly reinforced paranoid
          delusions for months.
        </p>
        <p>
          Five other peer-reviewed papers from 2025 said variations of the same
          thing &mdash; Pichowicz et al. on missed crises, Brown / Iftikhar on
          ethics violations, Stanford HAI on stigma, PMC on the missing
          human-handoff protocol. The recommendation was always the same:{" "}
          <strong className="text-foreground">an independent, trajectory-aware safety layer.</strong>{" "}
          But nobody had shipped one. So we built it.
        </p>
        <p className="text-foreground">
          Tether is not another mental-health chatbot. Tether is the safety
          copilot every mental-health chatbot should have shipped with.
        </p>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        <Card className="glass">
          <CardContent className="p-4 text-sm">
            <Sparkles className="mb-2 h-4 w-4 text-primary" />
            <strong>Independent auditor.</strong> A second LLM, blind to the
            companion, watches every turn.
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-sm">
            <Shield className="mb-2 h-4 w-4 text-primary" />
            <strong>Trajectory-aware.</strong> Sees the entire transcript at
            once and catches what single-turn benchmarks miss.
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-sm">
            <Heart className="mb-2 h-4 w-4 text-primary" />
            <strong>Region-localized.</strong> Helpline cards default to your
            users&apos; country &mdash; iCall and Vandrevala in India, 988 in the
            US.
          </CardContent>
        </Card>
      </div>

      <Card className="glass mt-10 border-primary/30 bg-primary/5">
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div>
            <h3 className="font-semibold">Made for STEMINATE HACKS 2026.</h3>
            <p className="text-sm text-muted-foreground">
              Open-source, MIT-licensed. Runs entirely on free tiers.
            </p>
          </div>
          <Button asChild variant="gradient">
            <Link href="/sandbox">
              See the demo <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
