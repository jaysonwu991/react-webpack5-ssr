# React SSR with Falcon-like Architecture

A server-side rendered React application with an architecture inspired by Skyscanner's Falcon microsite platform. This implementation uses Webpack, pnpm workspaces, Nx monorepo structure, and a route-based configuration system.

## 🏗️ Architecture Overview

This project implements key Falcon architectural patterns:

- **Route-based configuration** - Centralized route configs with component data builders
- **Per-route HTML templates** - Customizable templates for different page types
- **Typed state management** - Shared types between server and client via `window.__APP_STATE__`
- **Code splitting** - Dynamic imports with `@loadable/component`
- **Monorepo structure** - Nx workspace with apps and shared libs
- **SSR with hydration** - Server renders HTML, client hydrates for interactivity

### Project Structure

```
react-vite-ssr/
├── apps/
│   ├── server/                    # Express server (SSR)
│   │   ├── src/
│   │   │   ├── index.ts          # Server entry point
│   │   │   ├── renderer.ts       # React SSR renderer
│   │   │   ├── routes/
│   │   │   │   └── routeConfig.ts # Route configuration system
│   │   │   └── templates/         # Per-route HTML templates
│   │   │       ├── home-page.html
│   │   │       ├── greeting-page.html
│   │   │       └── content-page.html
│   │   ├── project.json          # Nx project config
│   │   └── tsconfig.app.json     # TypeScript config
│   └── webapp/                    # React client app
│       ├── src/
│       │   ├── index.tsx         # Client hydration entry
│       │   ├── App.tsx           # Root component
│       │   └── components/
│       │       ├── Greeting/
│       │       └── Content/
│       ├── project.json
│       └── tsconfig.app.json
├── libs/
│   └── shared/                    # Shared types library
│       ├── src/
│       │   ├── index.ts
│       │   └── types.ts          # App state & component prop types
│       ├── project.json
│       └── tsconfig.lib.json
├── config/                        # Webpack configurations
│   ├── webpack.webapp.dev.ts
│   ├── webpack.webapp.prod.ts
│   ├── webpack.server.dev.ts
│   └── webpack.server.prod.ts
├── nx.json                        # Nx workspace config
├── pnpm-workspace.yaml            # pnpm workspace config
├── package.json                   # Root package.json
└── tsconfig.json                  # Base TypeScript config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 22.21.1 (specified in `.nvmrc`)
- pnpm 9.15.9+

### Installation

```bash
# Use correct Node version
nvm use

# Install dependencies with pnpm
pnpm install
```

### Development

```bash
# Start development server (watches and auto-restarts)
pnpm dev

# Server will be available at http://localhost:3000
```

The dev server includes:
- ✅ Webpack dev middleware
- ✅ Hot Module Replacement (HMR)
- ✅ Auto-restart on server changes
- ✅ Fast refresh for React components

### Production Build

```bash
# Build both server and client
pnpm build

# Start production server
NODE_ENV=production node dist/server/server.js
```

### Nx Commands

```bash
# Build specific project
npx nx build server
npx nx build webapp

# Build all projects in parallel
npx nx run-many -t build --all

# Lint all projects
npx nx run-many -t lint --all

# Typecheck all projects
npx nx run-many -t typecheck --all
```

## 📋 Key Features

### 1. Route-Based Configuration

Routes are centrally defined in [`apps/server/src/routes/routeConfig.ts`](apps/server/src/routes/routeConfig.ts):

```typescript
export const routeConfigs: RouteConfig[] = [
  {
    path: '/',
    buildState: buildHomePageState,
    template: 'home-page.html',
  },
  {
    path: '/hello/:name',
    buildState: buildGreetingPageState,
    template: 'greeting-page.html',
  },
  // ... more routes
];
```

Each route defines:
- **path**: URL pattern (Express format with params)
- **buildState**: Function to build component data from request
- **template**: HTML template file (optional)
- **transformHtml**: HTML transformation function (optional)

### 2. Component Data Builders

State builders create component props from request data:

```typescript
function buildGreetingPageState(req: Request): AppState {
  const name = req.params.name || 'Visitor';

  return {
    route: 'greeting',
    components: {
      Greeting: {
        name: `Hello, ${name}!`,
      },
    },
    meta: {
      title: `Greeting ${name} | React SSR Demo`,
      description: `Personalized greeting page for ${name}`,
    },
  };
}
```

### 3. Per-Route HTML Templates

Each route can use a custom HTML template with Handlebars:

```html
<!-- apps/server/src/templates/greeting-page.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <title>{{meta.title}}</title>
  <meta name="description" content="{{meta.description}}">
  {{{styleTags}}}
</head>
<body>
  <div class="page-header">
    <h1>👋 Greeting Page</h1>
  </div>
  <div id="root">{{{appHtml}}}</div>
  <script>window.__APP_STATE__ = {{{appState}}};</script>
  {{{scriptTags}}}
</body>
</html>
```

### 4. Shared Types

Types are defined once in [`libs/shared/src/types.ts`](libs/shared/src/types.ts) and used everywhere:

```typescript
export interface GreetingProps {
  name: string;
}

export interface ContentProps {
  message: string;
}

export interface RouteComponentData {
  Greeting?: GreetingProps;
  Content?: ContentProps;
}

export interface AppState {
  route: string;
  components: RouteComponentData;
  meta?: {
    title?: string;
    description?: string;
  };
}
```

Import with path alias:
```typescript
import type { AppState } from '@react-ssr-falcon/shared';
```

### 5. Server-Side Rendering Flow

1. **Request arrives** → Express matches route in [apps/server/src/index.ts:85](apps/server/src/index.ts#L85)
2. **Route config found** → State builder creates component data
3. **React renders** → Components rendered to HTML string
4. **Template renders** → HTML template filled with app HTML and state
5. **Response sent** → Complete HTML with embedded state

### 6. Client-Side Hydration

[Client entry](apps/webapp/src/index.tsx) reads `window.__APP_STATE__` and hydrates:

```typescript
const appState: AppState = window.__APP_STATE__;
hydrateRoot(container, <App {...appState.components} />);
```

### 7. Code Splitting

Components use `@loadable/component` for automatic code splitting:

```typescript
const Greeting = loadable(
  () => import(/* webpackChunkName: "Greeting" */ './components/Greeting')
);

const Content = loadable(
  () => import(/* webpackChunkName: "Content" */ './components/Content')
);
```

## 📄 Available Routes

| Route | Description | Components |
|-------|-------------|------------|
| `/` | Home page | Greeting + Content |
| `/hello` | Default greeting | Greeting (name: "Visitor") |
| `/hello/:name` | Personalized greeting | Greeting (custom name) |
| `/content` | Content demo | Content only |

## 🔧 Adding New Features

### Adding a New Component

1. **Create component** in `apps/webapp/src/components/`:
   ```tsx
   // apps/webapp/src/components/NewComponent/NewComponent.tsx
   import type { NewComponentProps } from '@react-ssr-falcon/shared';

   const NewComponent = ({ title }: NewComponentProps) => (
     <div>{title}</div>
   );

   export default NewComponent;
   ```

2. **Add props type** to `libs/shared/src/types.ts`:
   ```typescript
   export interface NewComponentProps {
     title: string;
   }

   export interface RouteComponentData {
     // ... existing
     NewComponent?: NewComponentProps;
   }
   ```

3. **Update root App** in `apps/webapp/src/App.tsx`:
   ```typescript
   const NewComponent = loadable(
     () => import(/* webpackChunkName: "NewComponent" */ './components/NewComponent')
   );

   const App = ({ Greeting: greetingProps, Content: contentProps, NewComponent: newProps }: RouteComponentData) => (
     <>
       {greetingProps && <Greeting {...greetingProps} />}
       {contentProps && <Content {...contentProps} />}
       {newProps && <NewComponent {...newProps} />}
     </>
   );
   ```

4. **Create state builder** in `apps/server/src/routes/routeConfig.ts`:
   ```typescript
   function buildNewPageState(req: Request): AppState {
     return {
       route: 'new-page',
       components: {
         NewComponent: {
           title: 'Hello from new component',
         },
       },
       meta: {
         title: 'New Page | React SSR Demo',
         description: 'New page description',
       },
     };
   }
   ```

5. **Add route config**:
   ```typescript
   export const routeConfigs: RouteConfig[] = [
     // ... existing routes
     {
       path: '/new',
       buildState: buildNewPageState,
       template: 'new-page.html', // optional
     },
   ];
   ```

6. **Create template** (optional) in `apps/server/src/templates/new-page.html`

### Adding a New Route (Without New Component)

Simply add a new config to `routeConfigs` with an existing component:

```typescript
{
  path: '/special-greeting',
  buildState: (req) => ({
    route: 'special-greeting',
    components: {
      Greeting: { name: 'Special Visitor!' },
    },
    meta: {
      title: 'Special Greeting',
      description: 'A special greeting page',
    },
  }),
  template: 'greeting-page.html',
}
```

## 🏛️ Falcon Patterns Implemented

### ✅ Implemented
- [x] Route-based configuration system
- [x] Per-route HTML templates
- [x] Component data builders
- [x] Typed state management (`window.__APP_STATE__`)
- [x] Shared type library
- [x] Nx monorepo structure
- [x] pnpm workspaces
- [x] Code splitting with loadable
- [x] SSR with client hydration
- [x] Parameterized routes

### 🔄 Falcon Features Not Yet Implemented
- [ ] Vite build system (still using Webpack)
- [ ] React 19 streaming SSR (`renderToPipeableStream`)
- [ ] SSR manifest for preload links
- [ ] Resolver pattern for data fetching
- [ ] Multiple verticals (flights, hotels, etc.)
- [ ] 100+ page type configurations
- [ ] Content API integration
- [ ] Platform middleware
- [ ] Feature flags/config service

## 🔍 Comparison with Falcon

| Feature | Falcon (Main) | This Implementation |
|---------|---------------|---------------------|
| Build System | Babel + Webpack | Babel + Webpack ✅ |
| Monorepo | Nx | Nx ✅ |
| Package Manager | pnpm | pnpm ✅ |
| React Version | 18.3.1 | 19.2.3 ✅ (upgraded) |
| SSR Method | renderToString | renderToString ✅ |
| Code Splitting | @loadable/component | @loadable/component ✅ |
| Routing | Route configs | Route configs ✅ |
| Templates | Handlebars | Handlebars ✅ |
| State | window.__internal | window.__APP_STATE__ ✅ |
| Shared Types | ✅ | ✅ |

## 🛠️ Technology Stack

- **React 19.2.3** - UI library (upgraded from 18.3.1)
- **Express 5.2.1** - Server framework (upgraded from 4.21.2)
- **Webpack 5.104.1** - Module bundler
- **Babel 7.28.5** - JavaScript transpiler (upgraded from 7.28.3)
- **TypeScript 5.9.3** - Type safety
- **@loadable/component 5.16.7** - Code splitting
- **Handlebars 4.7.8** - Template engine
- **Nx 22.3.3** - Monorepo tooling (upgraded from 20.8.3)
- **pnpm 9.15.9** - Package manager
- **Nodemon 3.1.11** - Development auto-restart (upgraded from 2.0.22)
- **Sass-embedded 1.97.1** - SCSS compilation (upgraded from 1.90.0)
- **Testing Library** - React testing utilities (upgraded to latest versions)

## 📚 Learning Resources

- [Falcon Documentation](../apps/landing-pages-docs) - Original Falcon docs
- [Nx Documentation](https://nx.dev) - Monorepo management
- [@loadable/component](https://loadable-components.com/) - Code splitting
- [Express.js](https://expressjs.com/) - Server framework
- [Handlebars](https://handlebarsjs.com/) - Templating

## 🤝 Contributing

This is a demonstration project implementing Falcon patterns. Key areas for contribution:

1. **Vite Migration** - Convert from Webpack to Vite
2. **React 19 Upgrade** - Implement streaming SSR
3. **More Components** - Add example components
4. **Tests** - Add unit and E2E tests
5. **Documentation** - Improve guides and examples

## 📝 Notes

- This implementation keeps Webpack (incremental enhancement approach)
- For full Vite migration, see `MIGRATION.md` in this directory
- Templates are in `apps/server/src/templates/` (not `packages/server/templates/`)
- The old `packages/` structure is deprecated, use `apps/` and `libs/`
- Path alias `@react-ssr-falcon/shared` resolves to `libs/shared/src/index.ts`

## 🐛 Troubleshooting

### "Cannot find module '@react-ssr-falcon/shared'"

Make sure TypeScript paths are configured correctly in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@react-ssr-falcon/shared": ["libs/shared/src/index.ts"]
    }
  }
}
```

### Webpack build errors

Ensure webpack configs point to the new structure:
- Client entry: `./apps/webapp/src/index.tsx`
- Server entry: `./apps/server/src/index.ts`

### Styles not loading in production

Check that MiniCssExtractPlugin is configured correctly and loadable-stats.json is generated.

---

**Made with ❤️ inspired by Skyscanner Falcon**
