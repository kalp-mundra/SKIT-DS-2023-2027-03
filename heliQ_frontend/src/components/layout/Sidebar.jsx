import { NavLink } from "react-router-dom";
import { Sun, X } from "lucide-react";
import { NAV_ITEMS } from "@/config/navigation";
import { APP_NAME, APP_TAGLINE } from "@/config/app";
import { cn } from "@/lib/cn";

/**
 * Desktop: fixed 16rem sidebar.
 * Mobile: slide-in drawer controlled by `open` / `onClose`.
 */
export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Backdrop (mobile only) */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-30 bg-slate-900/50 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        aria-label="Main navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-slate-300",
          "transition-transform duration-200 ease-out lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white">
              <Sun className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-base font-bold text-white">{APP_NAME}</p>
              <p className="text-xs text-slate-400">{APP_TAGLINE}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-500/15 text-brand-300"
                    : "hover:bg-slate-800 hover:text-white",
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-800 px-5 py-4 text-xs text-slate-500">
          <p className="font-medium text-slate-400">Final Year Project · DS-03</p>
          <p className="mt-0.5">SKIT, Jaipur · 2026-27</p>
        </div>
      </aside>
    </>
  );
}
