// Central place for app-wide constants. Rename the app here, nowhere else.
export const APP_NAME = "SolarSense";
export const APP_TAGLINE = "AI Solar Monitoring";
export const PROJECT_TITLE =
  "AI Based Solar Panel Energy Output Prediction & Fault Detection System";

// FastAPI base URL. In dev, Vite proxies "/api" -> http://localhost:8000
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
