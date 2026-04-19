import type { Helpline, ResourceCard } from "./types";

export const HELPLINES: Helpline[] = [
  {
    name: "iCall (TISS)",
    number: "+91 9152987821",
    region: "IN",
    hours: "Mon–Sat, 8 am – 10 pm IST",
    url: "https://icallhelpline.org/",
  },
  {
    name: "Vandrevala Foundation",
    number: "1860 2662 345",
    region: "IN",
    hours: "24×7",
    url: "https://www.vandrevalafoundation.com/",
  },
  {
    name: "AASRA",
    number: "+91 9820466726",
    region: "IN",
    hours: "24×7",
    url: "http://www.aasra.info/",
  },
  {
    name: "988 Suicide & Crisis Lifeline",
    number: "988",
    region: "US",
    hours: "24×7",
    url: "https://988lifeline.org/",
  },
  {
    name: "Crisis Text Line",
    number: "Text HOME to 741741",
    region: "US",
    hours: "24×7",
    url: "https://www.crisistextline.org/",
  },
];

export function buildResourceCard(
  axis: "crisis" | "delusion" | "stigma" | "sycophancy" | "drift",
  region: "IN" | "US" | "Global" = "Global",
): ResourceCard {
  const inLines = HELPLINES.filter((h) => h.region === "IN");
  const usLines = HELPLINES.filter((h) => h.region === "US");
  const helplines =
    region === "IN" ? inLines : region === "US" ? usLines : [...inLines.slice(0, 2), ...usLines.slice(0, 1)];

  if (axis === "crisis") {
    return {
      title: "You don't have to face this alone",
      body: "What you're describing sounds painful and serious. A trained human counselor can talk with you right now — these lines are free, confidential, and used by people in exactly your situation.",
      helplines,
    };
  }
  if (axis === "delusion") {
    return {
      title: "Let's pause and reach out to someone you trust",
      body: "Some of what you've shared is hard to verify, and I shouldn't be the only voice you hear about it. A counselor or trusted clinician can help you think it through safely.",
      helplines,
    };
  }
  if (axis === "drift") {
    return {
      title: "A check-in from Tether",
      body: "We've been talking for a long stretch and I don't want to be a substitute for the people in your life. Consider reaching out to a human supporter today.",
      helplines,
    };
  }
  return {
    title: "Support beyond this chat",
    body: "If anything we've discussed feels heavier than you can carry alone, please reach out to a human.",
    helplines,
  };
}
