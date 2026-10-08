import { useState } from "react";
import { CircleCheck } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { alerts } from "@/data/mockData";
import { SEVERITY } from "@/lib/status";
import { cn } from "@/lib/cn";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "critical", label: "Critical" },
  { key: "warning", label: "Warning" },
  { key: "info", label: "Info" },
];

export default function Faults() {
  const [filter, setFilter] = useState("all");

  const countFor = (key) =>
    key === "all" ? alerts.length : alerts.filter((a) => a.severity === key).length;

  const visible =
    filter === "all" ? alerts : alerts.filter((a) => a.severity === filter);

  return (
    <>
      <PageHeader
        title="Faults & Alerts"
        description="Faults detected by the AI model and system alerts."
        actions={<Badge variant="info">Sample data</Badge>}
      />

      {/* Severity filter */}
      <div
        role="tablist"
        aria-label="Filter alerts by severity"
        className="mb-4 flex flex-wrap gap-2"
      >
        {FILTERS.map(({ key, label }) => {
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(key)}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
                active
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
              )}
            >
              {label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs",
                  active ? "bg-white/25" : "bg-slate-100 text-slate-500",
                )}
              >
                {countFor(key)}
              </span>
            </button>
          );
        })}
      </div>

      <Card>
        {visible.length === 0 ? (
          <EmptyState
            icon={CircleCheck}
            title="No alerts"
            description="Nothing to report for this severity."
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {visible.map((alert) => {
              const sev = SEVERITY[alert.severity];
              const Icon = sev.icon;
              return (
                <li
                  key={alert.id}
                  className={cn(
                    "flex items-start gap-4 px-5 py-4",
                    alert.resolved && "opacity-60",
                  )}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${sev.tile}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                      <Badge variant={sev.variant}>{sev.label}</Badge>
                      {alert.resolved && <Badge variant="success">Resolved</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{alert.message}</p>
                    <p className="mt-1.5 text-xs text-slate-400">
                      {alert.id} · Panel {alert.panelId} · {alert.time}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
}
