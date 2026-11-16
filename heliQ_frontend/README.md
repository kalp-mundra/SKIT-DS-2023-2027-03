# SolarSense - Frontend Dashboard

Frontend for the final year project **AI Based Solar Panel Energy Output Prediction & Fault Detection System**
(SKIT, CSE Data Science, Project ID SKIT/DS/2023-2027/3, Session 2026-27).

**Stack:** React 19 - Vite - Tailwind CSS v4 (frontend) | FastAPI + PostgreSQL + scikit-learn/TensorFlow (backend & ML, handled by teammates)

## Getting started

```bash
npm install
cp .env.example .env     # optional in development
npm run dev              # http://localhost:5173
npm run build            # production build into dist/
```

In development, requests to `/api/*` are proxied to the FastAPI server at `http://localhost:8000`.

## Sprint roadmap (Frontend & Dashboard)

| # | Task | Dates | Status |
|---|------|-------|--------|
| 1 | React environment setup | 1 Aug - 31 Aug 2026 | Done |
| 2 | UI structure development | 1 Sep - 15 Sep 2026 | Done |
| 3 | React & Tailwind development | 16 Sep - 15 Oct 2026 | In progress |
| 4 | Dashboard development | 16 Oct - 15 Nov 2026 | Pending |
| 5 | Recharts data visualization | 16 Nov - 15 Dec 2026 | Pending |
| 6 | Fault alerts & monitoring | 16 Dec 2026 - 15 Jan 2027 | Pending |
| 7 | Backend integration & responsiveness | 16 Jan - 28 Feb 2027 | Pending |
| 8 | Testing, optimization & documentation | 1 Mar - 31 Mar 2027 | Pending |

## Project structure

```
src/
  components/
    layout/   MainLayout, Sidebar, Topbar   (app shell)
    ui/       Card, StatCard, Badge, Button, PageHeader, EmptyState
  config/     app.js (name, API url), navigation.js (routes + sidebar)
  data/       mockData.js (TEMPORARY sample data, replaced by API later)
  lib/        cn.js (class helper), status.js (status/severity styles)
  pages/      Dashboard, Panels, Predictions, Faults, NotFound
```

## Notes

- All numbers shown in the UI are **sample data** from `src/data/mockData.js`. They are replaced with FastAPI data in the backend-integration sprint.
- The generation chart on the dashboard is a placeholder; real charts use Recharts (data-visualisation sprint).
- Prediction form field names are placeholders and must be aligned with the ML model's feature list.
