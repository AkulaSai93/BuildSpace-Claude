# BuildSpace

Next.js + TypeScript project scaffold.

## Structure

- `src/app` — App Router routes, layouts, API routes (route groups: `(auth)`, `(dashboard)`)
- `src/components` — `ui` (primitives), `layout` (header/footer), `shared` (reusable), `dashboard` (dashboard-specific UI)
- `src/lib` — core utilities/helpers and mock data
- `src/hooks` — custom React hooks
- `src/types` — shared TypeScript types
- `src/services` — API/data-fetching layer
- `src/store` — global state management
- `src/utils` — misc utility functions
- `src/constants` — app-wide constants
- `src/config` — app configuration
- `public` — static assets
- `tests` — unit, integration, e2e tests

## Getting started

```bash
npm install
npm run dev
```

## Dashboard screen

The first screen after login/signup lives at `src/app/(dashboard)/dashboard/page.tsx`,
built from the BuildSpace Figma dev-mode design (header/nav, stats, Continue Building,
Trending This Week). The `/` route redirects here.
