import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { panels } from "@/data/mockData";
import { PANEL_STATUS } from "@/lib/status";

export default function Panels() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return panels.filter((p) => {
      const matchesStatus = status === "all" || p.status === status;
      const matchesQuery =
        !q ||
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [query, status]);

  return (
    <>
      <PageHeader
        title="Panels"
        description="Status and performance of every panel in the plant."
        actions={<Badge variant="info">Sample data</Badge>}
      />

      <Card>
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative sm:w-72">
            <span className="sr-only">Search panels</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, name or location"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-brand-400 focus:outline-none"
            />
          </label>

          <div className="flex items-center gap-3">
            <label htmlFor="status-filter" className="sr-only">
              Filter by status
            </label>
            <select
              id="status-filter"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-brand-400 focus:outline-none"
            >
              <option value="all">All statuses</option>
              {Object.entries(PANEL_STATUS).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label}
                </option>
              ))}
            </select>
            <span className="whitespace-nowrap text-sm text-slate-500">
              {filtered.length} of {panels.length}
            </span>
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No panels found"
            description="Try a different search term or clear the status filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Panel</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Output</th>
                  <th className="px-5 py-3">Temp</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => {
                  const meta = PANEL_STATUS[p.status];
                  const pct = Math.round((p.currentKw / p.ratedKw) * 100);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-slate-900">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.id}</p>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{p.location}</td>
                      <td className="px-5 py-3.5">
                        <p className="text-slate-700">
                          {p.currentKw.toFixed(2)}
                          <span className="text-slate-400"> / {p.ratedKw.toFixed(2)} kW</span>
                        </p>
                        <div className="mt-1.5 h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${meta.bar}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{p.temperature} °C</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">{p.lastUpdated}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
