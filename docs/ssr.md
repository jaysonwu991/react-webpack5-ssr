# SSR implementation

How server rendering works end-to-end and how route loaders feed props into components.

## Graph (high level)

```mermaid
flowchart TD
  Request((HTTP request)) --> Router

  subgraph Server
    Router[Express router\n(server.ts)]
    BuildState[Build AppState\n(routes/appRoutes.ts + componentData.ts)]
    Render[buildRenderContext\n(webapp/src/ssr/createRenderContext.ts)]
    Stream[renderToPipeableStream]
  end

  Router --> BuildState --> Render --> Stream --> Response((HTML stream))

  subgraph Assets
    Template[Index template\n(index.html or dist/webapp/index.html)]
    Manifest[SSR manifest\n(dist/webapp/ssr-manifest.json)]
  end

  Template --> Render
  Manifest --> Render

  subgraph Client
    Hydrate[entry-client.tsx\nrenderApp(state)]
  end

  Response --> Hydrate
```

## Commands

- Dev: `pnpm dev` → `nx serve server` (Express + Vite middleware with HMR).
- Build: `pnpm build` → `nx build webapp` (client + SSR bundles).
- Preview: `pnpm preview` → `nx run server:preview` (production Express server).

## Request lifecycle

- Requests flow through the Express routes defined in `apps/server/src/server.ts`, which build `AppState` objects using helpers in `apps/server/src/routes/appRoutes.ts`.
- The server chooses the HTML template: dev uses Vite's `transformIndexHtml`; prod reads `dist/webapp/index.html`.
- Loads `buildRenderContext` from `apps/webapp/src/ssr/createRenderContext.ts` (bundled to `dist/server/createRenderContext.*` in prod).
- Each route builds an `AppState` (route key + component props) using helpers in `apps/server/src/routes/componentData.ts` and passes it to `buildRenderContext`, which renders `<RootApp>` via `renderApp` and emits preload links from the SSR manifest when available.
- The server injects:
  - `<!--preload-links-->` → modulepreload/stylesheet tags for the client entry.
  - `<!--app-state-->` → `<script>window.__APP_STATE__ = ...</script>` containing the serialized `AppState`.
- HTML is streamed with `renderToPipeableStream`; the client hydrates the same tree.

## Client hydration

- `apps/webapp/src/entry-client.tsx` reads `window.__APP_STATE__` and hydrates `renderApp(state)`.
- `RootApp` is the shared layout; it receives `activeRoute` for nav highlighting and renders whatever components are present in the state.

## Controlling component visibility

- Express routes return component props using helpers in `apps/server/src/routes/componentData.ts`.
- Examples:
  - Home route (`/`) uses `fetchHomeProps()` → GreetingCard + CalloutBanner.
  - Greeting-only routes (`/hello` and `/hello/:name`) use `fetchGreetingCardProps(params.name)`.
  - Callout-only route (`/callout`) uses `fetchCalloutBannerProps()`.
- Each page renders only the components present in the route response, keeping SSR + hydration aligned per route.

## Adding a new component

- Extend `AppBootstrapData["components"]` with the new component's props in `libs/shared/src/types/appData.ts`.
- Add a data builder in `apps/server/src/routes/componentData.ts`, return it from the appropriate Express route in `apps/server/src/routes/appRoutes.ts`, and render it inside `apps/webapp/src/app/renderApp.tsx`.
- If you add new route keys or component payloads, extend `libs/shared/src/types/appState.ts` so both server and client share the shape.

## Builds and manifest usage

- `pnpm build` (aka `nx build webapp`) outputs:
  - Client bundle in `dist/webapp` plus an SSR manifest (`dist/webapp/ssr-manifest.json`).
  - Server bundle in `dist/server/createRenderContext.*`.
- The SSR manifest is used to emit preload links for the client entry to warm the browser cache before hydration.
