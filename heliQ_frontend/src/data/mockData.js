// ---------------------------------------------------------------------------
// TEMPORARY SAMPLE DATA
// Used only to build and style the interface. It will be replaced by real data
// from the FastAPI backend during "Backend integration" (Jan-Feb 2027).
// Keep the shape of these objects close to what the API is expected to return.
// ---------------------------------------------------------------------------

export const summary = {
  currentOutputKw: 42.6,
  todayEnergyKwh: 286.4,
  predictedTomorrowKwh: 312.8,
};

export const environment = {
  irradiance: 812, // W/m²
  ambientTemp: 34, // °C
  humidity: 38, // %
  windSpeed: 3.2, // m/s
};

// status: "healthy" | "warning" | "fault" | "offline"
export const panels = [
  { id: "PNL-001", name: "Array A · Panel 01", location: "Rooftop A", ratedKw: 0.55, currentKw: 0.52, temperature: 41, status: "healthy", lastUpdated: "1 min ago" },
  { id: "PNL-002", name: "Array A · Panel 02", location: "Rooftop A", ratedKw: 0.55, currentKw: 0.51, temperature: 42, status: "healthy", lastUpdated: "1 min ago" },
  { id: "PNL-003", name: "Array A · Panel 03", location: "Rooftop A", ratedKw: 0.55, currentKw: 0.44, temperature: 47, status: "warning", lastUpdated: "1 min ago" },
  { id: "PNL-004", name: "Array A · Panel 04", location: "Rooftop A", ratedKw: 0.55, currentKw: 0.53, temperature: 40, status: "healthy", lastUpdated: "1 min ago" },
  { id: "PNL-005", name: "Array B · Panel 01", location: "Rooftop B", ratedKw: 0.55, currentKw: 0.31, temperature: 58, status: "fault", lastUpdated: "2 min ago" },
  { id: "PNL-006", name: "Array B · Panel 02", location: "Rooftop B", ratedKw: 0.55, currentKw: 0.5, temperature: 43, status: "healthy", lastUpdated: "2 min ago" },
  { id: "PNL-007", name: "Array B · Panel 03", location: "Rooftop B", ratedKw: 0.55, currentKw: 0.38, temperature: 44, status: "warning", lastUpdated: "2 min ago" },
  { id: "PNL-008", name: "Array B · Panel 04", location: "Rooftop B", ratedKw: 0.55, currentKw: 0.52, temperature: 41, status: "healthy", lastUpdated: "2 min ago" },
  { id: "PNL-009", name: "Array C · Panel 01", location: "Ground mount", ratedKw: 0.55, currentKw: 0, temperature: 30, status: "offline", lastUpdated: "3 h ago" },
  { id: "PNL-010", name: "Array C · Panel 02", location: "Ground mount", ratedKw: 0.55, currentKw: 0.49, temperature: 42, status: "healthy", lastUpdated: "1 min ago" },
  { id: "PNL-011", name: "Array C · Panel 03", location: "Ground mount", ratedKw: 0.55, currentKw: 0.22, temperature: 46, status: "fault", lastUpdated: "1 min ago" },
  { id: "PNL-012", name: "Array C · Panel 04", location: "Ground mount", ratedKw: 0.55, currentKw: 0.51, temperature: 41, status: "healthy", lastUpdated: "1 min ago" },
];

// severity: "critical" | "warning" | "info"
export const alerts = [
  { id: "ALT-1042", panelId: "PNL-005", title: "Overheating detected", severity: "critical", message: "Panel temperature is 58 °C, about 17 °C above the array average.", time: "12 min ago", resolved: false },
  { id: "ALT-1041", panelId: "PNL-011", title: "String fault suspected", severity: "critical", message: "Output is 55% below the expected value for current irradiance.", time: "38 min ago", resolved: false },
  { id: "ALT-1040", panelId: "PNL-003", title: "Dust accumulation", severity: "warning", message: "Efficiency dropped 14% over the last 5 days. Cleaning recommended.", time: "2 h ago", resolved: false },
  { id: "ALT-1039", panelId: "PNL-007", title: "Partial shading", severity: "warning", message: "Recurring output dip between 3 PM and 5 PM.", time: "5 h ago", resolved: false },
  { id: "ALT-1038", panelId: "PNL-009", title: "Panel offline", severity: "warning", message: "No data received since 09:40 AM. Check the connection.", time: "3 h ago", resolved: false },
  { id: "ALT-1037", panelId: "PNL-002", title: "Data logger firmware updated", severity: "info", message: "Firmware v2.3 installed successfully.", time: "Yesterday", resolved: true },
];
