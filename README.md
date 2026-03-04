# Z Venture

> **Status:** Early-stage development. The project is functional in parts, but not yet a complete playable experience.

**Live deployment:** [z-venture.vercel.app](https://z-venture.vercel.app)

Z Venture is a browser-first RPG prototype built with Next.js App Router, Prisma, and PostgreSQL. It includes account creation/sign-in, game creation/continuation, map-based location movement, and save snapshots.

## What is currently implemented

- Account flow: sign up, sign in, logout, cookie-based sessions
- Per-user game profiles: create new game, continue last game
- Save model: auto-saves on location changes + manual/quick save endpoint
- Game pages: main status, inventory, map, game settings placeholder
- Home pages: about, settings placeholder, route-level auth redirects
- Reliability/security primitives: retry wrapper for DB calls, request rate limiting, security headers

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **UI:** React 19 + Tailwind CSS v4
- **Database:** PostgreSQL
- **ORM:** Prisma 7 + Neon adapter (`@prisma/adapter-neon`)
- **Tests:** Jest + Testing Library (jsdom)
- **Package manager:** pnpm

## Project structure (high level)

- `app/` — routes, layouts, server actions, API routes, UI components
- `utils/` — game data, DB helpers, retry/validation/rate-limit logic, shared types
- `prisma/` — Prisma schema/config and generated client output
- `lib/` — Prisma client setup and client-only local save helper
- `__tests__/` — unit/component tests for UI and utility behavior
- `electron/` — lightweight Electron wrapper that loads deployed web app

## Route map

### Home/auth routes

- `/` — home
- `/signin` — sign-in form
- `/signup` — sign-up form
- `/login` — redirects to `/signin` (308)
- `/new` — create a new game
- `/continue` — continue a saved game
- `/about` — project about page
- `/settings` — home settings placeholder

### Game routes

- `/game` — current game dashboard (stats, inventory summary, saves, current location)
- `/game/inventory` — inventory details
- `/game/map` — location map + movement actions
- `/game/settings` — game settings placeholder

### API routes

- `GET /game/api/health` — simple health check payload
- `POST /game/api/save` — creates a manual save from current game state

## Authentication and session model

- Session token is stored in an HTTP-only cookie named `session`
- Session records are persisted in the `Session` table with expiry
- Session lookup resolves current user by token
- Game routes block unauthorized users via `unauthorized()`
- Sign-in and sign-up actions are rate-limited

## Data model (Prisma)

Core entities in `prisma/schema.prisma`:

- `User` (credentials, timestamps, last game pointer)
- `Session` (token-based auth sessions)
- `Game` (owned by user)
- `Save` (snapshot history for a game)
- `GameState` (state payload linked to one save)

Key relationship notes:

- One `User` → many `Game`
- One `Game` → many `Save`
- One `Save` → one `GameState`
- Game names are unique per user (`@@unique([username, name])`)

## Environment variables

Create a `.env` file in the project root.

Required:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME"
```

Optional:

```bash
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

`NEXT_PUBLIC_BASE_URL` is used by `/login` redirect; when missing, it falls back to `http://localhost:3000`.

## Local development setup

### 1) Install dependencies

```bash
pnpm install
```

### 2) Prepare database + Prisma client

```bash
pnpm db:push
pnpm db:gen
```

### 3) Run development server

```bash
pnpm dev
```

App default URL: `http://localhost:3000`

## Available scripts

```bash
pnpm dev         # next dev
pnpm build       # next build
pnpm start       # next start
pnpm lint        # eslint
pnpm test        # jest
pnpm test:watch  # jest --watch
pnpm db:push     # prisma db push (with npx fallback)
pnpm db:gen      # prisma generate (with npx fallback)
```

## Testing

Current test coverage focuses on navigation and utility behavior:

- `__tests__/homeButtons.test.tsx`
- `__tests__/navBar.test.tsx`
- `__tests__/sideNav.test.tsx`
- `__tests__/urls.test.ts`
- `__tests__/strFmtCheck.test.ts`
- additional component tests in `__tests__/`

Run tests:

```bash
pnpm test
```

## Reliability and security details

- DB operations are wrapped with exponential-backoff retry helper (`withRetry`)
- In-memory request rate limiting is applied to:
    - sign-in attempts
    - sign-up attempts
    - save endpoint requests
- Global security headers configured in `next.config.ts` include:
    - `X-Frame-Options`
    - `X-Content-Type-Options`
    - `Referrer-Policy`
    - `Permissions-Policy`
    - `Content-Security-Policy`

## Electron wrapper (optional)

`electron/index.js` opens the hosted app URL in an Electron shell. This is separate from the Next.js local dev workflow.

## Common troubleshooting

- **`DATABASE_URL environment variable is not set`**
    - Add `DATABASE_URL` to `.env` and restart the process.
- **Prisma client issues after schema change**
    - Re-run `pnpm db:push` then `pnpm db:gen`.
- **Unauthorized page while accessing `/game`**
    - Sign in first; ensure session cookie exists and has not expired.
- **Rate-limit errors during auth/save tests**
    - Wait for the configured window to reset and retry.

## License and usage restrictions

This repository is licensed under [CC BY-NC-ND 4.0](LICENSE).

In plain terms, this code is shared for viewing/reference under the license terms; do not use it commercially or create derivative works outside what the license permits.
