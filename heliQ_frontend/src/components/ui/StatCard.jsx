import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

const TONES = {
  brand: "bg-brand-100 text-brand-700",
  emerald: "bg-emerald-100 text-emerald-700",
  sky: "bg-sky-100 text-sky-700",
  rose: "bg-rose-100 text-rose-700",
};

const TREND = {
  up: { icon: TrendingUp, className: "text-emerald-600" },
  down: { icon: TrendingDown, className: "text-rose-600" },
  neutral: { icon: Minus, className: "text-slate-500" },
};

/**
 * A KPI tile: label, big number, optional unit and a small trend line.
 * <StatCard title="Current output" value="42.6" unit="kW" icon={Zap} trend="+4.2% vs yesterday" trendType="up" />
 */
export default function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  tone = "brand",
  trend,
  trendType = "neutral",
}) {
  const TrendIcon = TREND[trendType].icon;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              {value}
            </span>
            {unit && <span className="text-sm text-slate-500">{unit}</span>}
          </p>
        </div>
        {Icon && (
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              TONES[tone],
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
      </div>
      {trend && (
        <p
          className={cn(
            "mt-3 flex items-center gap-1 text-xs font-medium",
            TREND[trendType].className,
          )}
        >
          <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {trend}
        </p>
      )}
    </Card>
  );
}
