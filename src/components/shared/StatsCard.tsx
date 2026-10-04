import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  highlight?: boolean;
  amberAccent?: boolean;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  highlight,
  amberAccent,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-neutral-800/80 bg-neutral-900/80 transition-all hover:border-neutral-700",
        amberAccent && "border-amber-500/30 bg-gradient-to-br from-neutral-900 to-amber-950/20",
        highlight && "ring-1 ring-amber-500/40"
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            {title}
          </p>
          <div
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center",
              amberAccent
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-neutral-800 text-neutral-300 border border-neutral-700"
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <p className="text-2xl font-bold tracking-tight text-white font-mono">
            {value}
          </p>
          {trend && (
            <span
              className={cn(
                "inline-flex items-center text-xs font-semibold gap-0.5",
                trend.isPositive ? "text-emerald-400" : "text-red-400"
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {trend.value}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="mt-1 text-xs text-neutral-500 font-medium">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
