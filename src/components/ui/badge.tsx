import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-amber-500/20 text-amber-400 border-amber-500/30",
        secondary:
          "border-transparent bg-neutral-800 text-neutral-300",
        destructive:
          "border-transparent bg-red-500/20 text-red-400 border-red-500/30",
        outline: "text-foreground border-neutral-700",
        success:
          "border-transparent bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        info: "border-transparent bg-blue-500/20 text-blue-400 border-blue-500/30",
        warning:
          "border-transparent bg-amber-500/20 text-amber-400 border-amber-500/30",
        purple:
          "border-transparent bg-purple-500/20 text-purple-400 border-purple-500/30",
        // Urgency Badges
        urgencyNormal: "bg-neutral-800 text-neutral-300 border-neutral-700",
        urgencyTomorrow: "bg-blue-950/70 text-blue-300 border-blue-600/40",
        urgencyToday: "bg-amber-950/70 text-amber-300 border-amber-500/60 font-bold",
        urgencyOverdue: "bg-red-950/80 text-red-300 border-red-500 font-bold animate-pulse",
        // Pipeline States
        pipelineScript: "bg-blue-950/50 text-blue-400 border-blue-500/40",
        pipelineShoot: "bg-orange-950/50 text-orange-400 border-orange-500/40",
        pipelineRaw: "bg-yellow-950/50 text-yellow-400 border-yellow-500/40",
        pipelineEditing: "bg-purple-950/50 text-purple-400 border-purple-500/40",
        pipelineQa: "bg-pink-950/50 text-pink-400 border-pink-500/40",
        pipelineReview: "bg-cyan-950/50 text-cyan-400 border-cyan-500/40",
        pipelineRevision: "bg-red-950/50 text-red-400 border-red-500/40",
        pipelineApproved: "bg-emerald-950/50 text-emerald-400 border-emerald-500/40",
        pipelineDelivered: "bg-green-900/60 text-green-300 border-green-400 font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
