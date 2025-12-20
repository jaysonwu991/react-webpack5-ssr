# SSR implementation

How server rendering works end-to-end and how route configs feed props into components.

## Graph (high level)

```mermaid
flowchart TD
  Request((HTTP request)) --> Router

  subgraph Server
    Router[Express router\n(server.ts)]
    BuildState[Build AppState\n(routes.ts)]
    Render[buildRenderContext\n(webapp/render.tsx)]
    Stream[renderToPipeableStream]
  end

  Router --> BuildState --> Render --> Stream --> Response((HTML stream))

  subgraph Assets
    Template[Index template\n(index.html or dist/webapp/index.html)]
    Manifest[SSR manifest\n(dist/webapp/.vite/ssr-manifest.json)]
  end

  Template --> Render
  Manifest --> Render

  subgraph Client
    Hydrate[index.tsx\nhydrateRoot with App]
  end

  Response --> Hydrate
```

## Commands

- Dev: `pnpm dev` → `nx serve server` (Express + Vite middleware with HMR).
- Build: `pnpm build` → `nx build webapp` (client + SSR bundles).
- Preview: `pnpm preview` → `nx run server:preview` (production Express server).

## Request lifecycle

- Requests flow through the Express routes defined in [apps/server/server.ts](apps/server/server.ts), which are configured from [apps/server/routes.ts](apps/server/routes.ts) and build `AppState` objects using the inline `buildState` functions.
- The server chooses the HTML template:
  - Dev uses [index.html](index.html) transformed by Vite's `transformIndexHtml`
  - Prod reads [dist/webapp/index.html](dist/webapp/index.html)
  - Custom route templates can be specified in route configs (e.g., [apps/server/templates/home-page.html](apps/server/templates/home-page.html))
- Loads `buildRenderContext` from [apps/webapp/render.tsx](apps/webapp/render.tsx) (bundled to `dist/server/render.*` in prod).
- Each route builds an `AppState` (route key + component props) using the `buildState` function defined in the route config and passes it to `buildRenderContext`, which renders the component tree via `renderApp` and emits preload links from the SSR manifest when available.
- The server injects:
  - `<!--preload-links-->` → modulepreload/stylesheet tags for the client entry.
  - `<!--app-state-->` → `<script>window.__APP_STATE__ = ...</script>` containing the serialized `AppState`.
- HTML is streamed with `renderToPipeableStream`; the client hydrates the same tree.

## Client hydration

- [apps/webapp/index.tsx](apps/webapp/index.tsx) reads `window.__APP_STATE__` and hydrates the `App` component with the component data.
- [apps/webapp/App.tsx](apps/webapp/App.tsx) is the root component that conditionally renders Greeting and Content components based on what's present in the state.

## Controlling component visibility

- Express routes return component props using the `buildState` functions defined inline in [apps/server/routes.ts](apps/server/routes.ts).
- Routes can also provide optional template paths and template transforms in [apps/server/routes.ts](apps/server/routes.ts) so the server can use custom HTML templates (from [apps/server/templates/](apps/server/templates/)) or tweak `<title>`/meta content per route before streaming HTML to the client.
- Examples:
  - Home route (`/`) uses `buildHomePageState()` → Greeting + Content components with [home-page.html](apps/server/templates/home-page.html) template.
  - Greeting-only routes (`/hello` and `/hello/:name`) use `buildGreetingPageState(req)` → Greeting component with custom name from URL params using [greeting-page.html](apps/server/templates/greeting-page.html) template.
  - Content-only route (`/content`) uses `buildContentPageState()` → Content component only with [content-page.html](apps/server/templates/content-page.html) template.
- Each page renders only the components present in the route response, keeping SSR and hydration aligned per route.

## Adding a new component

- Extend `RouteComponentData` with the new component's props in [libs/shared/types.ts](libs/shared/types.ts).
- Add a new component to [apps/webapp/components/](apps/webapp/components/).
- Update the route's `buildState` function in [apps/server/routes.ts](apps/server/routes.ts) to include the new component's props, and render it inside [apps/webapp/App.tsx](apps/webapp/App.tsx).
- If you add new route keys or component payloads, extend the types in [libs/shared/types.ts](libs/shared/types.ts) so both server and client share the shape.

## Builds and manifest usage

- `pnpm build` (aka `nx build webapp`) outputs:
  - Client bundle in [dist/webapp](dist/webapp) plus a manifest ([dist/webapp/.vite/manifest.json](dist/webapp/.vite/manifest.json)) and SSR manifest ([dist/webapp/.vite/ssr-manifest.json](dist/webapp/.vite/ssr-manifest.json)).
  - Server SSR bundle in [dist/server/render.*](dist/server/render.*) (compiled from [apps/webapp/render.tsx](apps/webapp/render.tsx)).
- The client manifest is used to emit preload links for the client entry to warm the browser cache before hydration.
