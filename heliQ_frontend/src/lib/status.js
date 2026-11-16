import { OctagonAlert, TriangleAlert, Info } from "lucide-react";

// Panel status -> label, Badge variant and progress-bar colour
export const PANEL_STATUS = {
  healthy: { label: "Healthy", variant: "success", bar: "bg-emerald-500" },
  warning: { label: "Warning", variant: "warning", bar: "bg-amber-500" },
  fault: { label: "Fault", variant: "danger", bar: "bg-rose-500" },
  offline: { label: "Offline", variant: "neutral", bar: "bg-slate-400" },
};

// Alert severity -> label, Badge variant, icon and icon tile colours
export const SEVERITY = {
  critical: { label: "Critical", variant: "danger", icon: OctagonAlert, tile: "bg-rose-100 text-rose-600" },
  warning: { label: "Warning", variant: "warning", icon: TriangleAlert, tile: "bg-amber-100 text-amber-600" },
  info: { label: "Info", variant: "info", icon: Info, tile: "bg-sky-100 text-sky-600" },
};
