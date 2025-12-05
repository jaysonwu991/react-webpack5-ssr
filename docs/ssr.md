# SSR implementation

How server rendering works end-to-end and how data controls what gets hydrated on the client.

## Commands

- Dev: `pnpm dev` → `nx serve server` (Express + Vite middleware with HMR).
- Build: `pnpm build` → `nx build webapp` (client + SSR bundles).
- Preview: `pnpm preview` → `nx run server:preview` (production Express server).

## Request lifecycle

- All routes hit `apps/server/src/server.ts`, which builds `bootstrapData` with a `components` map (e.g., include `greetingCard` data to show it; omit it to hide).
- Chooses the HTML template: dev uses Vite's `transformIndexHtml`; prod reads `dist/client/index.html`.
- Loads `buildRenderContext` from `apps/server/src/ssr/createRenderContext.tsx` (bundled to `dist/server/createRenderContext.*` in prod).
- `buildRenderContext` renders `<RootApp {...bootstrapData.components} />`, optionally adding preload links from the SSR manifest.
- The server injects:
  - `<!--preload-links-->` → modulepreload/stylesheet tags for the client entry.
  - `<!--app-state-->` → `<script>window.INITIAL_DATA = ...</script>` containing `bootstrapData`.
- The server currently renders HTML with `renderToString` for reliability in both dev and preview; the client entry hydrates after the HTML is sent.

## Client hydration

- `apps/webapp/src/entry-client.tsx` reads `window.INITIAL_DATA` (fallbacks to `{ components: {} }`).
- It hydrates `RootApp` with `initialData.components`.
- `RootApp` conditionally renders each component only when its props exist, so SSR output matches hydration and missing data means the component is hidden.

## Controlling component visibility

- Add data for a component under `bootstrapData.components`; leaving it undefined keeps it off both server and client.
- Example (server):
  ```ts
  const bootstrapData = {
    components: {
      greetingCard: { name: "Jayson" }, // shown
      calloutBanner: {}, // shown
      // newComponent: { ... }           // add to render; omit to hide
    },
  };
  ```
- This keeps SSR HTML and client hydration aligned—no hidden server-only fragments or client-only inserts.

## Adding a new component

- Extend `AppBootstrapData["components"]` with the new component's props in `libs/shared/src/types/appData.ts`.
- Render it conditionally in `RootApp` using those props.
- Provide its data from `apps/server/src/server.ts` (or from your real data source) inside the `components` map.

## Builds and manifest usage

- `pnpm build` (aka `nx build webapp`) outputs:
  - Client bundle in `dist/client` plus an SSR manifest (`dist/client/ssr-manifest.json`).
  - Server bundle in `dist/server/createRenderContext.*`.
- The SSR manifest is used to emit preload links for the client entry to warm the browser cache before hydration.
