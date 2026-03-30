# Project Summary

## What this project is

CityScope is a frontend-only urban intelligence demo built with React 19 and Vite. It presents a cyber-themed interface with four main routes:

- `/` landing page with product-style marketing UI
- `/dashboard` authority dashboard with a mock login gate and static KPI widgets
- `/map` Delhi intelligence map with live requests to the Overpass API
- `/report` issue reporting flow with animated UI, file upload, and browser geolocation

## How it works

- Routing is handled in `src/App.jsx` with `react-router-dom`
- Styling is done with Tailwind CSS v4 plus custom CSS in `src/index.css`
- Motion and transitions use `framer-motion`
- Maps use `leaflet` and `react-leaflet`
- Charts/icons use `recharts` and `lucide-react`
- The only live data fetches are in `src/pages/cityscopeApi.ts`, which calls the public Overpass API for Delhi map overlays

## What is real vs mock

- The dashboard content is static demo data behind a client-side login screen
- The report flow is a UI simulation only; it does not submit to a backend
- The map uses real Overpass API requests, but the labels, severity framing, and some visual overlays are presentation-layer mockups
- Uploaded photos are previewed locally in the browser and not persisted anywhere

## Run requirements

- Node.js 18+ is required
- npm is required
- Internet access is needed for package installation and for the live map data/tiles
- A browser is needed for geolocation, file upload, and the Leaflet UI

## Run steps

```bash
npm install
npm run dev
```

Then open the local Vite URL, normally `http://localhost:5173`.

## Notable limitations

- No backend, database, auth service, or persistence layer is included
- No environment variables are currently required
- If Overpass API is unavailable, the map silently falls back to empty layers
- `src/components/report/PhotoUploadWithScan.tsx` creates object URLs without revoking them, which can leak memory during repeated uploads
- `src/components/report/LocationSnippet.tsx` calls `getCurrentPosition` but stores the result in a variable named `watchId`; there is no cleanup path because it is not using `watchPosition`
