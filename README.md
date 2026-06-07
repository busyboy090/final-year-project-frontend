# ADUN-EMS Frontend

React/Vite dashboard for the Admiralty University Event Management System.

## Setup

```bash
npm install --package-lock=false --legacy-peer-deps
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` to the backend origin, for example `http://localhost:3000`.
Leave it empty only when the frontend is served from the same origin as the API.

## Checks

```bash
npm run build
npm test
```

`npm test` currently runs the production build as a smoke test.

## Key Areas

- `/dashboard/admin` manages users, events, venues, faculties, departments, facilities, attendance, and reports.
- `/dashboard/student` and `/dashboard/staff` let users browse approved events and view registrations.
- `/dashboard/event-organiser` supports organiser dashboards and event creation.
