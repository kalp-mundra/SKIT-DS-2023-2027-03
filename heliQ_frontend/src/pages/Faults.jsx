import { useEffect, useState } from "react";
import { CircleCheck } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { SEVERITY } from "@/lib/status";
import { cn } from "@/lib/cn";
import { API_BASE_URL } from "@/config/app";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "critical", label: "Critical" },
  { key: "warning", label: "Warning" },
  { key: "info", label: "Info" },
];

export default function Faults() {
  const [filter, setFilter] = useState("all");
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/faults?severity=all`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch fault alerts.");
        }

        const data = await response.json();
        setAlerts(data.alerts || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const countFor = (key) =>
    key === "all"
      ? alerts.length
      : alerts.filter((a) => a.severity === key).length;

  const visible =
    filter === "all"
      ? alerts
      : alerts.filter((a) => a.severity === filter);

return (
  <>
    <PageHeader
      title="Faults & Alerts"
      description="Potential anomalies detected in historical solar generation data."
      actions={<Badge variant="info">Historical data</Badge>}
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
      {loading ? (
        <div className="px-5 py-12 text-center text-sm text-slate-500">
          Loading fault alerts...
        </div>
      ) : error ? (
        <div className="px-5 py-12 text-center">
          <p className="text-sm font-medium text-red-600">
            Unable to load alerts
          </p>
          <p className="mt-1 text-sm text-slate-500">{error}</p>
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={CircleCheck}
          title="No alerts"
          description="Nothing to report for this severity."
        />
      ) : (
        <ul className="divide-y divide-slate-100">
          {visible.map((alert) => {
            const sev = SEVERITY[alert.severity];

            if (!sev) return null;

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
                    <p className="text-sm font-semibold text-slate-900">
                      {alert.title}
                    </p>
                    <Badge variant={sev.variant}>{sev.label}</Badge>
                    {alert.resolved && (
                      <Badge variant="success">Resolved</Badge>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {alert.message}
                  </p>

                  <p className="mt-1.5 text-xs text-slate-400">
                    {alert.id} ·{" "}
                    {alert.panelId
                      ? `Panel ${alert.panelId}`
                      : "Site-level observation"}{" "}
                    · {new Date(alert.time).toLocaleString()}
                  </p>

                  {alert.duration_minutes != null && (
                    <p className="mt-1 text-xs text-slate-400">
                      Duration: {alert.duration_minutes} minutes
                    </p>
                  )}
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
