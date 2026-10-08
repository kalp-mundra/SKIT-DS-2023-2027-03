import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  CloudSun,
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
import { summary, environment, panels, alerts } from "@/data/mockData";
import { PANEL_STATUS, SEVERITY } from "@/lib/status";

const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function Dashboard() {
  const [lastUpdated, setLastUpdated] = useState(() => formatTime(new Date()));

  // Values derived from the (sample) data
  const activeAlerts = alerts.filter((a) => !a.resolved);
  const criticalCount = activeAlerts.filter((a) => a.severity === "critical").length;
  const healthyCount = panels.filter((p) => p.status === "healthy").length;
  const healthyPct = Math.round((healthyCount / panels.length) * 100);

  const conditions = [
    { label: "Irradiance", value: environment.irradiance, unit: "W/m²", icon: SunMedium },
    { label: "Ambient temp", value: environment.ambientTemp, unit: "°C", icon: Thermometer },
    { label: "Humidity", value: environment.humidity, unit: "%", icon: Droplets },
    { label: "Wind speed", value: environment.windSpeed, unit: "m/s", icon: Wind },
  ];

  return (
    <>
      <PageHeader
        title="Solar Monitoring Dashboard"
        description={`Last updated at ${lastUpdated}`}
        actions={
          <>
            <Badge variant="info">Sample data</Badge>
            <Button
              variant="secondary"
              icon={RotateCcw}
              onClick={() => setLastUpdated(formatTime(new Date()))}
            >
              Refresh
            </Button>
          </>
        }
      />

      {/* KPI cards */}
      <section
        aria-label="Key metrics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          title="Current output"
          value={summary.currentOutputKw}
          unit="kW"
          icon={Zap}
          tone="brand"
          trend="+4.2% vs same time yesterday"
          trendType="up"
        />
        <StatCard
          title="Energy generated today"
          value={summary.todayEnergyKwh}
          unit="kWh"
          icon={SunMedium}
          tone="emerald"
          trend="78% of the daily target"
        />
        <StatCard
          title="Tomorrow's forecast"
          value={summary.predictedTomorrowKwh}
          unit="kWh"
          icon={CloudSun}
          tone="sky"
          trend="+9.2% vs today"
          trendType="up"
        />
        <StatCard
          title="Active alerts"
          value={activeAlerts.length}
          icon={TriangleAlert}
          tone="rose"
          trend={`${criticalCount} critical`}
        />
      </section>

      {/* Generation chart + panel health */}
      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Energy generation today"
            description="Actual vs predicted output (kW)"
          />
          <CardBody>
            {/* The real chart is built later with Recharts (Nov-Dec 2026) */}
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-center">
              <Activity className="h-8 w-8 text-slate-300" aria-hidden="true" />
              <p className="mt-2 text-sm font-medium text-slate-500">
                Generation chart placeholder
              </p>
              <p className="text-xs text-slate-400">
                Recharts visualisation planned for the data-visualisation sprint
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Panel health" description={`${panels.length} panels monitored`} />
          <CardBody>
            <p className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight text-slate-900">
                {healthyPct}%
              </span>
              <span className="text-sm text-slate-500">healthy</span>
            </p>

            <ul className="mt-5 space-y-4">
              {Object.entries(PANEL_STATUS).map(([key, meta]) => {
                const count = panels.filter((p) => p.status === key).length;
                const pct = (count / panels.length) * 100;
                return (
                  <li key={key}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{meta.label}</span>
                      <span className="text-slate-500">{count}</span>
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

      {/* Recent alerts + current conditions */}
      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent alerts"
            description="Latest issues found by the monitoring system"
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
              const sev = SEVERITY[alert.severity];
              const Icon = sev.icon;
              return (
                <li key={alert.id} className="flex items-start gap-4 px-5 py-4">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${sev.tile}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                      <Badge variant={sev.variant}>{sev.label}</Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500">{alert.message}</p>
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
          <CardHeader title="Current conditions" description="Weather at the plant" />
          <CardBody className="grid grid-cols-2 gap-3">
            {conditions.map(({ label, value, unit, icon: Icon }) => (
              <div key={label} className="rounded-lg bg-slate-50 p-3">
                <Icon className="h-5 w-5 text-brand-600" aria-hidden="true" />
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  {value}
                  <span className="ml-1 text-xs font-normal text-slate-500">{unit}</span>
                </p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </CardBody>
        </Card>
      </section>
    </>
  );
}
