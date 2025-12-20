# Falcon SSR Demo

A server-side rendered React application implementing Skyscanner's Falcon microsite architecture patterns using Nx monorepo, pnpm workspaces, and React 19 with SSR.

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
│   │   ├── server.ts                  # Main server entry
│   │   ├── routes.ts                  # Route definitions, state builders & config
│   │   ├── templates/                 # HTML templates
│   │   │   ├── home-page.html         # Home page template
│   │   │   ├── greeting-page.html     # Greeting page template
│   │   │   └── content-page.html      # Content page template
│   │   └── project.json               # Nx project configuration
│   └── webapp/          # React client application
│       ├── index.tsx                  # Client hydration entry
│       ├── App.tsx                    # Root component
│       ├── render.tsx                 # SSR renderer with buildRenderContext
│       ├── components/                # UI components
│       │   ├── Greeting/              # Greeting component
│       │   │   ├── GreetingComponent.tsx
│       │   │   └── GreetingComponent.scss
│       │   └── Content/               # Content component
│       │       ├── ContentComponent.tsx
│       │       └── ContentComponent.scss
│       ├── styles/                    # Global styles
│       │   └── global.scss
│       └── project.json               # Nx project configuration
├── libs/
│   └── shared/          # Shared types and utilities
│       ├── types.ts                   # Shared TypeScript types
│       ├── constants/
│       │   └── ssrEntry.ts            # SSR entry constants
│       ├── index.ts                   # Public API exports
│       └── package.json               # Package configuration
├── docs/
│   ├── ssr.md                         # End-to-end SSR flow documentation
│   └── webpack-to-vite-migration.md   # Webpack to Vite migration guide
├── index.html           # HTML entry point for Vite (dev mode)
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── nx.json              # Nx workspace configuration
├── pnpm-workspace.yaml  # pnpm workspace configuration
└── package.json         # Root package.json with scripts
```

## Key Features

- ✅ Server-side rendering (SSR) with React 19
- ✅ Route-based configuration system (Falcon-inspired)
- ✅ Centralized route configs with state builders
- ✅ Typed state management with shared types
- ✅ Vite-powered HMR in development
- ✅ Production SSR with Vite SSR bundle
- ✅ Nx monorepo structure
- ✅ pnpm workspace management
- ✅ TypeScript throughout
- ✅ ESLint and Stylelint for code quality

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with HMR (Express + Vite middleware) |
| `pnpm build` | Build client assets and SSR bundle for production |
| `pnpm preview` | Run production Express server |
| `pnpm lint` | Lint all projects with ESLint |
| `pnpm lint:fix` | Auto-fix ESLint issues |
| `pnpm lint:css` | Lint CSS/SCSS files with Stylelint |
| `pnpm lint:css:fix` | Auto-fix CSS/SCSS issues |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm clean` | Clean build artifacts and cache |

## Available Routes

| URL | Description |
|-----|-------------|
| `/` | Home page with Greeting + Content components |
| `/hello` | Default greeting page |
| `/hello/:name` | Personalized greeting with dynamic name parameter |
| `/content` | Content component demonstration page |

## Route-driven Component Data

- Express routes and component state builders are configured in [apps/server/routes.ts](apps/server/routes.ts), which defines the `AppState` for each route
- Each route configuration includes:
  - URL pattern (Express format)
  - `buildState` function that creates component props from the request
  - Optional template path (custom HTML templates in [apps/server/templates/](apps/server/templates/))
  - Optional template transforms for custom SEO/meta injection
- Shared route state types (`AppState`, `RouteComponentData`) live in [libs/shared/types.ts](libs/shared/types.ts)
- SSR injects `window.__APP_STATE__` so the client hydrates the exact page and props the server rendered

### Examples

- Home route (`/`) uses `buildHomePageState()` → Greeting + Content components with [home-page.html](apps/server/templates/home-page.html) template
- Greeting-only routes (`/hello` and `/hello/:name`) use `buildGreetingPageState(req)` → Greeting component with custom name using [greeting-page.html](apps/server/templates/greeting-page.html) template
- Content-only route (`/content`) uses `buildContentPageState()` → Content component only with [content-page.html](apps/server/templates/content-page.html) template

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

1. **Route-based configuration** - Centralized route configs with inline state builders in [apps/server/routes.ts](apps/server/routes.ts)
2. **Typed state management** - Shared types between server and client ([libs/shared/types.ts](libs/shared/types.ts))
3. **Component data builders** - Server-side data preparation functions in route configs
4. **Monorepo structure** - Nx workspace with apps and libs
5. **SSR with hydration** - Server renders HTML ([apps/webapp/render.tsx](apps/webapp/render.tsx)), client hydrates with exact same state ([apps/webapp/index.tsx](apps/webapp/index.tsx))

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

