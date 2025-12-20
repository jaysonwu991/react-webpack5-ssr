# Falcon SSR Demo

A server-side rendered React application implementing Skyscanner's Falcon microsite architecture patterns using Nx monorepo, pnpm workspaces, and React 19 with SSR - now powered by Vite for both dev (with HMR) and production SSR.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run production preview
pnpm preview
```

Visit [http://localhost:3000](http://localhost:3000) to see the app running.

## What this repo shows

- Vite-powered dev/prod SSR running through a single Express server
- React 19 SSR + hydration (server renders HTML; client hydrates)
- Falcon-inspired route-based configuration system
- Express routes prepare component props per page for SSR + hydration
- Nx workspace layout (`apps` + `libs`) with pnpm workspaces
- TypeScript throughout with shared types

## Prerequisites

- pnpm >= 10.24 (see `packageManager` in [package.json](package.json))
- Node.js (version compatible with React 19)

## Setup

Run `pnpm install` (with pnpm v10.24+) to refresh the lockfile and install Nx locally.

## Project Structure

```
react-vite-ssr/
├── apps/
│   ├── server/          # Express SSR server
│   │   ├── src/
│   │   │   ├── server.ts              # Main server entry
│   │   │   └── routes/
│   │   │       ├── routeConfig.ts     # Route definitions & config
│   │   │       ├── appRoutes.ts       # Route state builders
│   │   │       └── componentData.ts   # Component data loaders
│   │   └── templates/                 # Per-route HTML templates
│   └── webapp/          # React client application
│       ├── src/
│       │   ├── entry-client.tsx       # Client hydration entry
│       │   ├── App.tsx                # Root component
│       │   ├── components/            # UI components
│       │   └── ssr/
│       │       └── createRenderContext.ts  # SSR renderer
│       └── vite.config.ts
├── libs/
│   └── shared/          # Shared types and utilities
│       └── src/types/
│           ├── appState.ts            # AppState, RouteKey types
│           └── appData.ts             # Component data types
├── types/
│   └── global.d.ts      # Global declarations (window.__APP_STATE__)
├── docs/
│   └── ssr.md           # End-to-end SSR flow documentation
├── nx.json              # Nx workspace configuration
├── pnpm-workspace.yaml  # pnpm workspace configuration
└── package.json         # Root package.json with scripts
```

## Key Features

- ✅ Server-side rendering (SSR) with React 19
- ✅ Route-based configuration system (Falcon-inspired)
- ✅ Per-route HTML templates with custom template transforms
- ✅ Typed state management with shared types
- ✅ Vite-powered HMR in development
- ✅ Production SSR with Vite SSR bundle
- ✅ Nx monorepo structure
- ✅ pnpm workspace management
- ✅ TypeScript throughout

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with HMR (Express + Vite middleware) |
| `pnpm build` | Build client assets and SSR bundle for production |
| `pnpm preview` | Run production Express server |
| `pnpm lint` | Lint all projects |
| `pnpm lint:fix` | Auto-fix linting issues |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm clean` | Clean build artifacts and cache |

## Available Routes

| URL | Description |
|-----|-------------|
| `/` | Home page with GreetingCard + CalloutBanner components |
| `/hello` | Default greeting page |
| `/hello/:name` | Personalized greeting with dynamic name |
| `/callout` | Callout-only page with custom template |

## Route-driven Component Data

- Express routes + default props are configured in [apps/server/src/routes/routeConfig.ts](apps/server/src/routes/routeConfig.ts), which wires the `AppState` builders into the Express router
- Component prop builders live in [apps/server/src/routes/componentData.ts](apps/server/src/routes/componentData.ts) (they accept config, e.g. names via env vars `GREETING_DEFAULT_NAME` and `GREETING_HOME_NAME`)
- Route configs can also define template transforms so each route gets custom `<title>`/meta content before the server injects `<!--app-state-->`/`<!--preload-links-->`
- Route configs may point at server-side templates (see `apps/server/templates/{home-page,greeting-page,callout-landing}.html`) so each route can ship a distinct HTML layout + styling
- Shared route state types (`AppState`, `RouteKey`) live in [libs/shared/src/types/appState.ts](libs/shared/src/types/appState.ts)
- SSR injects `window.__APP_STATE__` so the client hydrates the exact page + props the server rendered

### Examples

- Home route (`/`) uses `buildHomeState()` → GreetingCard + CalloutBanner
- Greeting-only routes (`/hello` and `/hello/:name`) use `buildGreetingState(name)`
- Callout-only route (`/callout`) uses `buildCalloutState()`

## Technology Stack

- **React 19.2.3** - UI library with SSR support
- **Express 5.2.1** - Node.js server framework
- **Vite 7.2.7** - Build tool and dev server with HMR
- **TypeScript 5.9.3** - Type safety
- **Nx 22.2.3** - Monorepo tooling
- **pnpm 10.24.0** - Fast, disk-efficient package manager
- **Sass 1.96.0** - CSS preprocessing

## Falcon Architecture Patterns

This project implements key Falcon patterns:

1. **Route-based configuration** - Centralized route configs with state builders ([apps/server/src/routes/routeConfig.ts](apps/server/src/routes/routeConfig.ts))
2. **Per-route templates** - Customizable HTML templates for different pages with template transforms
3. **Typed state management** - Shared types between server and client ([libs/shared/src/types/](libs/shared/src/types/))
4. **Component data builders** - Server-side data preparation ([apps/server/src/routes/componentData.ts](apps/server/src/routes/componentData.ts))
5. **Monorepo structure** - Nx workspace with apps and libs

## SSR Documentation

For a deeper walkthrough of the SSR pipeline and how data flows into the client, see [docs/ssr.md](docs/ssr.md).

## Contributing

1. Follow the existing code style and TypeScript patterns
2. Use the Nx CLI for running tasks: `nx <target> <project>`
3. Ensure type safety across server/client boundaries
4. Test SSR behavior in both dev and production modes

## License

MIT

---

**Inspired by Skyscanner's Falcon microsite platform, powered by Vite**

