import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/components/settings-provider";
import { ToastProvider } from "@/components/ui/toast";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AIJudgeNotice } from "@/components/ai-judge-notice";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: "Tether AI — Safety copilot for AI mental-health chats",
    template: "%s · Tether AI",
  },
  description:
    "Tether AI is the first open, trajectory-aware safety layer for AI mental-health conversations. It watches every turn of any LLM companion and intervenes on crisis, delusion, stigma, sycophancy, and multi-turn drift.",
  metadataBase: new URL("https://tether.ai"),
  openGraph: {
    title: "Tether AI",
    description:
      "Real-time safety copilot for AI mental-health chatbots. Built for STEMINATE HACKS 2026.",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2322d3ee' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M22 12h-4l-3 9L9 3l-3 9H2'/></svg>",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} font-sans min-h-screen`}>
        <AIJudgeNotice />
        <SettingsProvider>
          <ToastProvider>
            <div className="relative flex min-h-screen flex-col">
              <div className="pointer-events-none fixed inset-0 -z-10 grid-bg opacity-40" />
              <div className="pointer-events-none fixed -top-40 left-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
              <div className="pointer-events-none fixed top-[20%] right-0 -z-10 h-[300px] w-[400px] rounded-full bg-accent/15 blur-[100px]" />
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </ToastProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
