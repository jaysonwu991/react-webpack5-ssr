# react-vite-ssr

Now powered by Vite for both dev (with HMR) and production SSR, organized with Nx + pnpm v10 (10.24+).

## What this repo shows

- Vite-powered dev/prod SSR running through a single Express server.
- React 19 SSR + hydration (server renders HTML; client hydrates).
- Express routes prepare component props per page for SSR + hydration.
- Nx workspace layout (`apps` + `libs`) with pnpm workspaces.

## Prereqs

- pnpm >= 10.24 (see `packageManager` in `package.json`).

## Setup

- Run `pnpm install` (with pnpm v10.24+) to refresh the lockfile and install Nx locally.

## Structure

- `apps/webapp` — client entry (`src/entry-client.tsx`), root app, and UI components.
- `apps/server` — Express server (`src/server.ts`).
- `apps/webapp/src/ssr` — SSR renderer entry (`createRenderContext.ts`).
- `libs/shared` — shared types such as `AppBootstrapData`.
- `types/global.d.ts` — global declarations for browser globals like `window.__APP_STATE__`.
- `docs/ssr.md` — end-to-end SSR flow, streaming, and hydration details.

## Scripts

- `pnpm dev` — `nx serve server` (Express + Vite middleware for hot reloading).
- `pnpm build` — `nx build webapp` (builds client assets into `dist/webapp` and SSR bundle into `dist/server/createRenderContext.*`).
- `pnpm preview` — `nx run server:preview` (production Express server).

Visit http://localhost:3000 after running `dev` or `preview`.

## Route-driven component data

- Express routes + default props are configured in `apps/server/src/routes/routeConfig.ts`, which wires the `AppState` builders into the Express router.
- Component prop builders live in `apps/server/src/routes/componentData.ts` (they accept config, e.g. names via env vars `GREETING_DEFAULT_NAME` and `GREETING_HOME_NAME`).
- Route configs can also define template transforms so each route gets custom `<title>`/meta content before the server injects `<!--app-state-->`/`<!--preload-links-->`.
- Route configs may point at server-side templates (see `apps/server/templates/{home-page,greeting-page,callout-landing}.html`) so each route can ship a distinct HTML layout + styling.
- Shared route state types (`AppState`, `RouteKey`) live in `libs/shared/src/types/appState.ts`.
- SSR injects `window.__APP_STATE__` so the client hydrates the exact page + props the server rendered.

### Examples

- Home route (`/`) uses `buildHomeState()` → GreetingCard + CalloutBanner.
- Greeting-only routes (`/hello` and `/hello/:name`) use `buildGreetingState(name)`.
- Callout-only route (`/callout`) uses `buildCalloutState()`.

## SSR docs

For a deeper walkthrough of the SSR pipeline and how data flows into the client, see `docs/ssr.md`.
