# react-webpack5-ssr

Now powered by Vite for both dev (with HMR) and production SSR, organized with Nx + pnpm v10 (10.24+).

## What this repo shows

- Vite-powered dev/prod SSR running through a single Express server.
- React 19 SSR + hydration (server renders HTML; client hydrates).
- Server-controlled component visibility via data/props passed to the client.
- Nx workspace layout (`apps` + `libs`) with pnpm workspaces.

## Prereqs

- pnpm >= 10.24 (see `packageManager` in `package.json`).

## Setup

- Run `pnpm install` (with pnpm v10.24+) to refresh the lockfile and install Nx locally.

## Structure

- `apps/webapp` — client entry (`src/entry-client.tsx`), root app, and UI components.
- `apps/server` — Express server (`src/server.ts`) and SSR renderer (`src/ssr/createRenderContext.tsx`).
- `libs/shared` — shared types such as `AppBootstrapData`.
- `types/global.d.ts` — global declarations for browser globals like `window.INITIAL_DATA`.
- `docs/ssr.md` — end-to-end SSR flow, streaming, and hydration details.

## Scripts

- `pnpm dev` — `nx serve server` (Express + Vite middleware for hot reloading).
- `pnpm build` — `nx build webapp` (builds client assets into `dist/client` and SSR bundle into `dist/server/createRenderContext.*`).
- `pnpm preview` — `nx run server:preview` (production Express server).

Visit http://localhost:3000 after running `dev` or `preview`.

## Component visibility from server data

- The server builds `AppBootstrapData.components`; any component omitted here is not rendered on the server or client.
- Example (see `apps/server/src/server.ts`):
  - Provide `greetingCard: { name: "Jayson" }` to show the GreetingCard.
  - Provide `calloutBanner: {}` to show the CalloutBanner.
- `RootApp` renders components conditionally based on the presence of these props, keeping SSR output and hydration in sync.

## SSR docs

For a deeper walkthrough of the SSR pipeline and how data flows into the client, see `docs/ssr.md`.
