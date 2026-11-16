import { useLocation } from "react-router-dom";
import { Bell, Menu, Search } from "lucide-react";
import { NAV_ITEMS } from "@/config/navigation";

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const current = NAV_ITEMS.find((item) => item.path === pathname);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6 lg:px-8">
      {/* Hamburger (mobile only) */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <p className="text-sm font-semibold text-slate-900">
        {current?.label ?? "Page not found"}
      </p>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* Search (visual only for now) */}
        <label className="relative hidden md:block">
          <span className="sr-only">Search</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search panels..."
            className="h-9 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none"
          />
        </label>

        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
            PA
          </span>
          <div className="hidden text-left leading-tight sm:block">
            <p className="text-sm font-medium text-slate-900">Plant Admin</p>
            <p className="text-xs text-slate-500">Operator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
