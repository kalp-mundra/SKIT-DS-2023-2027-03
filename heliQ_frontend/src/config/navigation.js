import {
  LayoutDashboard,
  SolarPanel,
  BrainCircuit,
  TriangleAlert,
} from "lucide-react";

// Single source of truth for sidebar links, routes and page titles.
export const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    description: "Live overview of your solar plant",
  },
  {
    label: "Panels",
    path: "/panels",
    icon: SolarPanel,
    description: "Status and performance of every panel",
  },
  {
    label: "Predictions",
    path: "/predictions",
    icon: BrainCircuit,
    description: "AI-based energy output forecasts",
  },
  {
    label: "Faults & Alerts",
    path: "/faults",
    icon: TriangleAlert,
    description: "Detected faults and system alerts",
  },
];
