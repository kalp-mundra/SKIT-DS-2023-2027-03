
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Droplets,
  RotateCcw,
  SunMedium,
  Thermometer,
  TriangleAlert,
  Wind,
  Zap,
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

import { alerts, panels } from "@/data/mockData";
import { API_BASE_URL } from "@/config/app";
import { PANEL_STATUS, SEVERITY } from "@/lib/status";

const formatTime = (date) =>
  date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/dashboard/summary`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Unable to fetch dashboard data."
        );
      }

      setSummary(data);
      setLastUpdated(formatTime(new Date()));
    } catch (err) {
      setError(err.message || "Backend connection failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // These panel and alert values are still sample data.
  const activeAlerts = alerts.filter((alert) => !alert.resolved);

  const criticalCount = activeAlerts.filter(
    (alert) => alert.severity === "critical"
  ).length;

  const healthyCount = panels.filter(
    (panel) => panel.status === "healthy"
  ).length;

  const healthyPct = Math.round(
    (healthyCount / panels.length) * 100
  );

  const conditions = summary
    ? [
        {
          label: "Irradiance",
          value: summary.average_irradiance,
          unit: "W/m²",
          icon: SunMedium,
        },
        {
          label: "Temperature",
          value: summary.average_temperature,
          unit: "°C",
          icon: Thermometer,
        },
        {
          label: "Humidity",
          value: summary.average_humidity,
          unit: "%",
          icon: Droplets,
        },
        {
          label: "Wind speed",
          value: summary.average_wind_speed,
          unit: "m/s",
          icon: Wind,
        },
      ]
    : [];

  return (
    <>
      <PageHeader
        title="Solar Monitoring Dashboard"
        description={
          summary
            ? `Historical dataset: ${summary.date} | Last fetched: ${lastUpdated}`
            : "Loading historical dataset..."
        }
        actions={
          <>
            <Badge variant="info">Historical data</Badge>
            <Button
              variant="secondary"
              icon={RotateCcw}
              onClick={fetchSummary}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </>
        }
      />

      {error && (
        <div className="mb-5 rounded-lg bg-rose-50 p-4 text-sm text-rose-700">
          <p className="font-semibold">
            Dashboard data unavailable
          </p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Real historical dataset metrics */}
      <section
        aria-label="Historical dataset metrics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          title="Energy generated (latest day)"
          value={summary ? summary.total_energy_kwh : "—"}
          unit={summary ? "kWh" : undefined}
          icon={Zap}
          tone="brand"
          trend={
            summary
              ? `Dataset date: ${summary.date}`
              : "Waiting for data"
          }
        />

        <StatCard
          title="Average irradiance"
          value={summary ? summary.average_irradiance : "—"}
          unit="W/m²"
          icon={SunMedium}
          tone="emerald"
          trend="Historical daily average"
        />

        <StatCard
          title="Average temperature"
          value={summary ? summary.average_temperature : "—"}
          unit="°C"
          icon={Thermometer}
          tone="sky"
          trend="Historical daily average"
        />

        <StatCard
          title="Average humidity"
          value={summary ? summary.average_humidity : "—"}
          unit="%"
          icon={Droplets}
          tone="rose"
          trend="Historical daily average"
        />
      </section>

      {/* Generation chart and sample panel health */}
      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Energy generation"
            description="Historical dataset — chart integration pending"
          />

          <CardBody>
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-center">
              <Activity
                className="h-8 w-8 text-slate-300"
                aria-hidden="true"
              />
              <p className="mt-2 text-sm font-medium text-slate-500">
                Generation chart placeholder
              </p>
              <p className="text-xs text-slate-400">
                Historical time-series visualisation will be added next.
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Panel health"
            description={`${panels.length} sample panels`}
            action={<Badge variant="neutral">Sample data</Badge>}
          />

          <CardBody>
            <p className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight text-slate-900">
                {healthyPct}%
              </span>
              <span className="text-sm text-slate-500">
                healthy
              </span>
            </p>

            <ul className="mt-5 space-y-4">
              {Object.entries(PANEL_STATUS).map(([key, meta]) => {
                const count = panels.filter(
                  (panel) => panel.status === key
                ).length;

                const pct = (count / panels.length) * 100;

                return (
                  <li key={key}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="font-medium text-slate-700">
                        {meta.label}
                      </span>
                      <span className="text-slate-500">
                        {count}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${meta.bar}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardBody>
        </Card>
      </section>

      {/* Sample alerts and real historical conditions */}
      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent alerts"
            description="Sample alerts — real fault detection is pending"
            action={
              <Link
                to="/faults"
                className="text-sm font-medium text-brand-700 hover:text-brand-800"
              >
                View all
              </Link>
            }
          />

          <ul className="divide-y divide-slate-100">
            {activeAlerts.slice(0, 4).map((alert) => {
              const severity = SEVERITY[alert.severity];
              const Icon = severity.icon;

              return (
                <li
                  key={alert.id}
                  className="flex items-start gap-4 px-5 py-4"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${severity.tile}`}
                  >
                    <Icon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {alert.title}
                      </p>
                      <Badge variant={severity.variant}>
                        {severity.label}
                      </Badge>
                    </div>

                    <p className="mt-0.5 text-sm text-slate-500">
                      {alert.message}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {alert.panelId} · {alert.time}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Historical conditions"
            description="Average values for the latest dataset day"
          />

          <CardBody className="grid grid-cols-2 gap-3">
            {conditions.map(
              ({ label, value, unit, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-lg bg-slate-50 p-3"
                >
                  <Icon
                    className="h-5 w-5 text-brand-600"
                    aria-hidden="true"
                  />

                  <p className="mt-2 text-xl font-semibold text-slate-900">
                    {value}
                    <span className="ml-1 text-xs font-normal text-slate-500">
                      {unit}
                    </span>
                  </p>

                  <p className="text-xs text-slate-500">
                    {label}
                  </p>
                </div>
              )
            )}

            {!summary && (
              <p className="col-span-2 text-sm text-slate-400">
                {loading
                  ? "Loading historical conditions..."
                  : "Historical conditions unavailable."}
              </p>
            )}
          </CardBody>
        </Card>
      </section>
    </>
  );
}
