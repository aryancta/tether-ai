import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        default: "bg-primary/15 text-primary ring-primary/30",
        secondary: "bg-secondary text-secondary-foreground ring-border",
        muted: "bg-muted text-muted-foreground ring-border",
        ok: "bg-ok/15 text-ok ring-ok/30",
        warn: "bg-warn/15 text-warn ring-warn/30",
        danger: "bg-danger/15 text-danger ring-danger/30",
        accent: "bg-accent/15 text-accent ring-accent/30",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
