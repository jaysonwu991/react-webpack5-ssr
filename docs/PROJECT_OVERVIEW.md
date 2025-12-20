# Falcon SSR Demo - Project Overview

A server-side rendered React application implementing Skyscanner's Falcon microsite architecture patterns using Nx monorepo, pnpm workspaces, and React 19 with SSR.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

Visit [http://localhost:3000](http://localhost:3000) to see the app running.

## Project Structure

```
react-vite-ssr/
├── apps/
│   ├── server/          # Express SSR server
│   └── webapp/          # React client application
├── libs/
│   └── shared/          # Shared types and utilities
├── config/              # Webpack configurations
├── nx.json              # Nx workspace configuration
├── pnpm-workspace.yaml  # pnpm workspace configuration
└── package.json         # Root package.json with scripts
```

## Key Features

- ✅ Server-side rendering (SSR) with React 19
- ✅ Route-based configuration system (Falcon-inspired)
- ✅ Per-route HTML templates with Handlebars
- ✅ Typed state management with shared types
- ✅ Code splitting with @loadable/component
- ✅ Nx monorepo structure
- ✅ pnpm workspace management
- ✅ TypeScript throughout

## Available Routes

| URL | Description |
|-----|-------------|
| `/` | Home page with Greeting + Content |
| `/hello` | Default greeting page |
| `/hello/:name` | Personalized greeting |
| `/content` | Content component demo |

## Technology Stack

- **React 19.2.3** - UI library with SSR support
- **Express 5.2.1** - Node.js server framework
- **TypeScript 5.9.3** - Type safety
- **Nx 22.3.3** - Monorepo tooling
- **pnpm 9.15.9** - Fast, disk-efficient package manager
- **@loadable/component 5.16.7** - React code splitting
- **Handlebars 4.7.8** - Template engine
- **Webpack 5.104.1** - Module bundler
- **Babel 7.28.5** - JavaScript transpiler

## Documentation

- **[Getting Started](GETTING_STARTED.md)** - Quick start guide and usage instructions
- **[Architecture](ARCHITECTURE.md)** - Detailed implementation guide and architectural patterns
- **[SSR Architecture](SSR-ARCHITECTURE.md)** - Deep dive into SSR rendering pipeline
- **[Changelog](CHANGELOG.md)** - Version history and recent changes

## Falcon Architecture Patterns

This project implements key Falcon patterns:

1. **Route-based configuration** - Centralized route configs with state builders
2. **Per-route templates** - Customizable HTML templates for different pages
3. **Typed state management** - Shared types between server and client
4. **Component data builders** - Server-side data preparation
5. **Monorepo structure** - Nx workspace with apps and libs

## Getting Help

See [GETTING_STARTED.md](GETTING_STARTED.md) for development workflow and [ARCHITECTURE.md](ARCHITECTURE.md) for architectural guidelines.

## License

MIT

---

**Inspired by Skyscanner's Falcon microsite platform**
