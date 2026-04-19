import { Sparkles, User2, Shield } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { cn, formatTime } from "@/lib/utils";
import { ResourceCardView } from "@/components/resource-card-view";

interface ChatBubbleProps {
  message: ChatMessage;
  align?: "left" | "right";
  showRewriteOriginal?: boolean;
  variant?: "default" | "danger";
}

export function ChatBubble({
  message,
  align = "left",
  showRewriteOriginal,
  variant = "default",
}: ChatBubbleProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const sideRight = align === "right" || isUser;

  return (
    <div
      className={cn(
        "flex w-full gap-2 animate-fade-in",
        sideRight ? "justify-end" : "justify-start",
      )}
    >
      {!sideRight ? (
        <div
          className={cn(
            "mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
            variant === "danger"
              ? "bg-danger/15 text-danger ring-1 ring-danger/40"
              : "bg-primary/15 text-primary ring-1 ring-primary/40",
          )}
        >
          {message.rewritten ? (
            <Shield className="h-3.5 w-3.5" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
        </div>
      ) : null}

      <div className={cn("max-w-[78%] space-y-2", sideRight && "items-end text-right")}>
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm",
            isUser
              ? "bg-secondary text-foreground rounded-br-md"
              : message.rewritten
                ? "bg-primary/10 text-foreground ring-1 ring-primary/30 rounded-bl-md"
                : variant === "danger"
                  ? "bg-danger/10 text-foreground ring-1 ring-danger/30 rounded-bl-md"
                  : "bg-card text-foreground ring-1 ring-border rounded-bl-md",
          )}
        >
          {message.content}
          {message.rewritten && showRewriteOriginal && message.originalContent ? (
            <details className="mt-2 text-[11px] text-muted-foreground">
              <summary className="cursor-pointer select-none text-primary/80">
                show original (rewritten by Tether)
              </summary>
              <div className="mt-1 rounded-md border border-border/60 bg-background/40 p-2 italic">
                {message.originalContent}
              </div>
            </details>
          ) : null}
        </div>

        {isAssistant && message.audit?.resourceCard ? (
          <ResourceCardView card={message.audit.resourceCard} />
        ) : null}

        <div className={cn("text-[10px] text-muted-foreground", sideRight && "pr-1")}>
          {formatTime(message.timestamp)}
          {message.audit ? ` · ${message.audit.source}` : ""}
        </div>
      </div>

      {sideRight ? (
        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground ring-1 ring-border">
          <User2 className="h-3.5 w-3.5" />
        </div>
      ) : null}
    </div>
  );
}
