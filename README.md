# VaPaTi front

Frontend of VaPaTi, a crowdfunding and donations platform. Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui + zustand. It talks to the REST API at `NEXT_PUBLIC_API_BASE_URL` (`http://localhost:8080` in development).

## Commands

```bash
npm install      # dependencies
npm run dev      # dev server on http://localhost:3000 (Turbopack)
npm run lint     # ESLint, including the layer import rules
npm run build    # production build
npm run start    # serve the production build
```

There is no test runner yet.

## Structure

```text
src/
├── app/            # routes: thin page.tsx files and layouts with the session guards
├── domain/         # per module: types, business rules, errors, permissions
├── data/           # HTTP provider, session store, one service per module, adapters
└── presentation/
    ├── components/ # ui/ (shadcn CLI), atoms/, molecules/, organisms/
    ├── pages/      # per module: client containers with the page state
    ├── hooks/      # per module: reads (useApiQuery) and actions
    └── utils/      # pure presentation helpers (cn, format, ...)
```

Imports always use the `@/` alias (`@/*` → `src/*`). `npm run lint` enforces which layer can import which: for example, components never import `@/data`, and `src/app` only imports `@/presentation`. The full table is in `specs/16-arquitectura-por-capas.md`.

To add a shadcn/ui primitive, run `npx shadcn@latest add <component>`; `components.json` sends it to `src/presentation/components/ui/`.
