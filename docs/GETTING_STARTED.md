# Quick Start Guide

## ✅ Implementation Complete!

Your `react-vite-ssr` folder now has a Falcon-like architecture with:

- ✅ **Nx monorepo** structure (apps/server, apps/webapp, libs/shared)
- ✅ **pnpm workspaces** for package management
- ✅ **Route-based configuration** system inspired by Falcon's pageTypeConfig
- ✅ **Per-route HTML templates** with Handlebars
- ✅ **Typed state management** with `window.__APP_STATE__`
- ✅ **Shared type library** for server/client consistency
- ✅ **Code splitting** with @loadable/component
- ✅ **SSR with hydration** using React 19.2.3 (upgraded from 18.3.1)
- ✅ **Latest dependencies** (December 2025)

## 🚀 Running the Application

### Development Mode

```bash
cd react-vite-ssr

# Start the development server
pnpm dev

# This will:
# 1. Build both client and server with webpack
# 2. Start watching for changes
# 3. Auto-restart server on changes
# 4. Enable HMR for client

# Server will be at: http://localhost:3000
```

### What Just Got Built

The build created:
- `dist/webapp/` - Client webpack bundle with code splitting
- `dist/server/` - Server bundle with Express app
- `dist/webapp/loadable-stats.json` - Code splitting manifest

## 📍 Available Routes

Once the server is running, visit:

| URL | Description |
|-----|-------------|
| http://localhost:3000/ | Home page with Greeting + Content components |
| http://localhost:3000/hello | Default greeting page |
| http://localhost:3000/hello/YourName | Personalized greeting |
| http://localhost:3000/content | Content component demo |

## 🔍 Key Files Created/Modified

### New Nx Monorepo Structure

```
apps/
├── server/src/
│   ├── index.ts              # ✨ New Express server with route system
│   ├── renderer.ts           # ✨ New SSR renderer
│   ├── routes/routeConfig.ts # ✨ New route configuration
│   └── templates/            # ✨ New per-route templates
│       ├── home-page.html
│       ├── greeting-page.html
│       └── content-page.html
│
├── webapp/src/
│   ├── index.tsx             # ✨ Updated client hydration
│   ├── App.tsx               # ✨ Updated root component
│   └── components/           # Moved from packages/client
│
libs/shared/src/
    ├── index.ts              # ✨ New shared exports
    └── types.ts              # ✨ New shared types

config/
    ├── webpack.webapp.dev.ts  # ✅ Updated entry paths
    ├── webpack.server.dev.ts  # ✅ Updated entry paths
    └── ...prod.ts files       # ✅ Updated entry paths
```

### Configuration Files

- ✨ `nx.json` - Nx workspace configuration
- ✨ `pnpm-workspace.yaml` - pnpm workspaces
- ✨ `.nvmrc` - Node version (22.21.1)
- ✅ `package.json` - Updated with Nx scripts
- ✅ `tsconfig.json` - Added path aliases

## 📚 Documentation

See [ARCHITECTURE.md](ARCHITECTURE.md) for:
- Detailed architecture explanation
- How to add new components
- How to add new routes
- Comparison with Falcon
- Troubleshooting guide

## 🎯 What's Different from Original Falcon?

### ✅ Implemented (Falcon-like)
- Route-based configuration system
- Per-route HTML templates
- Component data builders
- Typed state management
- Shared types library
- Nx monorepo
- pnpm workspaces
- Code splitting

### 🔄 Not Yet Implemented (Full Falcon)
- Vite build system (still Webpack)
- React 19 streaming SSR
- SSR manifest system
- Resolver pattern for data fetching
- Multiple verticals (flights, hotels, etc.)
- 100+ page configurations
- Platform middleware

## 🧪 Testing the Implementation

1. **Build succeeds**: ✅
   ```bash
   pnpm build
   # Result: All projects build successfully
   ```

2. **Server starts**: ✅
   ```bash
   pnpm dev
   # Result: Server running at http://localhost:3000
   ```

3. **Routes work**: Test by visiting the URLs listed above

4. **SSR works**: View page source - you should see rendered HTML, not just a div

5. **Hydration works**: Click interactive elements in components - check browser console

6. **HMR works**: Edit a component file and see changes without full reload

## 💡 Next Steps

1. **Start the dev server**: `pnpm dev`
2. **Visit http://localhost:3000** to see it in action
3. **Try different routes** (/, /hello, /hello/YourName, /content)
4. **View page source** to see SSR in action
5. **Read [ARCHITECTURE.md](ARCHITECTURE.md)** for adding features
6. **Try adding a new component** following the guide

## 🐛 Known Issues

- Templates use Handlebars - make sure syntax is correct when editing
- If you encounter build issues, try running `pnpm clean` first

## 🎉 Success Indicators

If you see these, everything is working:

- ✅ Build completes without errors
- ✅ Server starts on port 3000
- ✅ Page shows "Welcome to Falcon-like SSR" on home page
- ✅ URL parameter changes content (e.g., /hello/Alice shows "Hello, Alice!")
- ✅ View source shows full HTML (not empty div)
- ✅ Browser console has no errors
- ✅ Components are interactive after hydration

## 📞 Support

See [ARCHITECTURE.md](ARCHITECTURE.md) for:
- Architecture deep dive
- How-to guides
- Troubleshooting
- Comparison with Falcon

---

**Made with ❤️ inspired by Skyscanner Falcon**
