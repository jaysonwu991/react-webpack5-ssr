# react-webpack5-ssr

Now powered by Vite for both dev (with HMR) and production SSR.

## Structure
- `src/client` — client entry (`entry-client.tsx`), root app, and UI components.
- `src/server` — Express server (`server.ts`) and SSR renderer (`ssr/createRenderContext.tsx`).
- `src/shared` — shared types such as `AppBootstrapData`.
- `types/global.d.ts` — global declarations for browser globals like `window.INITIAL_DATA`.

## Scripts
- `pnpm dev` — start the Express server with Vite middleware for hot reloading.
- `pnpm build` — build client assets (`dist/client`) and the SSR bundle (`dist/server/createRenderContext.*`).
- `pnpm preview` — serve the built app in production mode using the same Express server.

Visit http://localhost:3000 after running `dev` or `preview`.
