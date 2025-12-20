# Changelog

## [December 20, 2025] - Package Upgrades

### 🎉 Major Package Updates

All dependencies have been upgraded to their latest versions as of December 20, 2025.

#### Runtime Dependencies
- ✅ **React** `18.3.1` → `19.2.3` (major version upgrade)
- ✅ **React DOM** `18.3.1` → `19.2.3` (major version upgrade)
- ✅ **Express** `4.21.2` → `5.2.1` (major version upgrade)
- ✅ **serialize-javascript** `6.0.2` → `7.0.2` (major version upgrade)

#### Development Dependencies
- ✅ **Nx** `20.5.0` → `22.3.3` (major version upgrade)
- ✅ **Babel Core** `7.28.3` → `7.28.5`
- ✅ **Babel Presets** `7.27.1/7.28.3` → `7.28.5` (all presets)
- ✅ **@testing-library/dom** `9.3.4` → `10.4.1` (major version upgrade)
- ✅ **@testing-library/jest-dom** `5.17.0` → `6.9.1` (major version upgrade)
- ✅ **@testing-library/react** `14.3.1` → `16.3.1` (major version upgrade)
- ✅ **@types/express** `4.17.23` → `5.0.6` (major version upgrade)
- ✅ **@types/node** `22.0.0` → `25.0.3` (major version upgrade)
- ✅ **@types/react** `18.3.24` → `19.2.7` (major version upgrade)
- ✅ **@types/react-dom** `18.3.7` → `19.2.3` (major version upgrade)
- ✅ **babel-loader** `9.2.1` → `10.0.0` (major version upgrade)
- ✅ **css-loader** `6.11.0` → `7.1.2` (major version upgrade)
- ✅ **css-minimizer-webpack-plugin** `5.0.1` → `7.0.4` (major version upgrade)
- ✅ **nodemon** `2.0.22` → `3.1.11` (major version upgrade)
- ✅ **sass-embedded** `1.90.0` → `1.97.1`
- ✅ **sass-loader** `16.0.5` → `16.0.6`
- ✅ **style-loader** `3.3.4` → `4.0.0` (major version upgrade)
- ✅ **terser-webpack-plugin** `5.3.14` → `5.3.16`
- ✅ **typescript** `5.9.2` → `5.9.3`
- ✅ **webpack-cli** `5.1.4` → `6.0.1` (major version upgrade)
- ✅ **webpack-dev-middleware** `6.1.3` → `7.4.5` (major version upgrade)
- ✅ **webpack-dev-server** `4.15.2` → `5.2.2` (major version upgrade)

### 📝 Documentation Updates
- ✅ Updated README.md with latest package versions
- ✅ Updated ARCHITECTURE.md with latest package versions and comparison table
- ✅ Updated GETTING_STARTED.md with latest package versions
- ✅ Added detailed upgrade notes in this CHANGELOG

### ⚠️ Known Issues
- **Build Configuration**: The webpack configuration files in the `config/` directory are now TypeScript files (`.ts` extension). Make sure all references in `project.json` files point to the correct `.ts` files.

### 🔧 Breaking Changes to Note
- **React 19**: New features and API changes. Review [React 19 upgrade guide](https://react.dev/blog/2025/04/25/react-19)
  - New hooks and APIs
  - Improved server components support
  - Better hydration handling
- **Express 5**: Some middleware changes. Review [Express 5 migration guide](https://expressjs.com/en/guide/migrating-5.html)
  - Middleware signature changes
  - Promise-based error handling
  - Removed deprecated methods
- **Nx 22**: New features and improvements. Review [Nx 22 release notes](https://nx.dev/changelog)
  - Enhanced caching
  - Better TypeScript support
  - Improved plugin architecture

### 🚀 Next Steps
1. Verify webpack configuration files in `config/` directory are using `.ts` extension
2. Update `project.json` files if needed to reference the correct `.ts` config files
3. Test the build process: `pnpm build`
4. Test the development server: `pnpm dev`
5. Verify all routes work correctly with React 19

---

# Cleanup Changelog - December 20, 2025

## Files and Folders Removed

### Obsolete Build Configuration
- ❌ **config/** - Old JavaScript Webpack configuration files (replaced with TypeScript versions)
  - `webpack.webapp.dev.js` → now `webpack.webapp.dev.ts`
  - `webpack.webapp.prod.js` → now `webpack.webapp.prod.ts`
  - `webpack.server.dev.js` → now `webpack.server.dev.ts`
  - `webpack.server.prod.js` → now `webpack.server.prod.ts`

### Obsolete Source Structure
- ❌ **packages/** - Old package structure (replaced by apps/ and libs/)
  - `packages/webapp/`
  - `packages/server/`
  - `packages/shared/`

### Build Artifacts
- ❌ **dist/** - Build output folder (will be regenerated)
  - `dist/webapp/`
  - `dist/server/`

### Configuration Files
- ❌ **.babelrc.js** - Babel configuration (now handled by Nx)
- ❌ **types/** - Redundant type definitions (consolidated in libs/shared)

## Files Renamed for Clarity

### Documentation
- ✅ `README.md` → `PROJECT_OVERVIEW.md` (old overview)
- ✅ `IMPLEMENTATION.md` → `ARCHITECTURE.md` (detailed architecture guide)
- ✅ `QUICKSTART.md` → `GETTING_STARTED.md` (getting started guide)
- ✅ Created new `README.md` (main entry point)
- ✅ Created `CHANGELOG.md` (this file)

### Components
- ✅ `apps/webapp/src/components/App1/` → `Greeting/` component directory
- ✅ `apps/webapp/src/components/App2/` → `Content/` component directory
- ✅ Renamed component files and updated all references

## Configuration Updates

### package.json
- ✅ Renamed package: `react-ssr-falcon` → `falcon-ssr-demo`
- ✅ Added description
- ✅ Removed obsolete legacy scripts
- ✅ Added `clean` script
- ✅ Added `lint:fix` script

### .gitignore
- ✅ Enhanced with comprehensive ignore patterns
- ✅ Added IDE-specific ignores
- ✅ Added cache directory patterns
- ✅ Added log file patterns
- ✅ Added environment variable patterns

## Current Project Structure

```
react-vite-ssr/
├── apps/
│   ├── server/              # Express SSR server
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── renderer.ts
│   │   │   ├── routes/
│   │   │   │   └── routeConfig.ts
│   │   │   └── templates/
│   │   │       ├── home-page.html
│   │   │       ├── greeting-page.html
│   │   │       └── content-page.html
│   │   ├── project.json
│   │   └── tsconfig.app.json
│   └── webapp/              # React client
│       ├── src/
│       │   ├── index.tsx
│       │   ├── App.tsx
│       │   └── components/
│       │       ├── Greeting/
│       │       │   ├── index.tsx
│       │       │   └── Greeting.scss
│       │       └── Content/
│       │           ├── index.tsx
│       │           └── Content.scss
│       ├── project.json
│       └── tsconfig.app.json
├── libs/
│   └── shared/              # Shared types
│       ├── src/
│       │   ├── index.ts
│       │   └── types.ts
│       ├── project.json
│       └── tsconfig.lib.json
├── .gitignore
├── .nvmrc
├── nx.json
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.json
├── README.md                # Main documentation
├── ARCHITECTURE.md          # Detailed architecture guide
├── GETTING_STARTED.md       # Quick start guide
├── PROJECT_OVERVIEW.md      # Original overview
└── CHANGELOG.md             # This file
```

## Benefits of This Cleanup

1. **Clearer Structure** - Better organized with meaningful names
2. **Reduced Confusion** - Removed obsolete files and configurations
3. **Better Documentation** - Clear hierarchy of documentation files
4. **Consistent Naming** - Components have descriptive names
5. **Improved Maintainability** - Easier to understand and navigate

## Migration Notes

If you had any custom modifications to the removed files, please:
1. Check the Nx project.json files in each app/lib
2. All build configuration is now in project.json files
3. Component imports have been updated automatically
4. The CSS class names have been updated to match component names

## Next Steps

1. Run `pnpm install` to ensure dependencies are up to date
2. Run `pnpm build` to verify everything builds correctly
3. Run `pnpm dev` to start the development server
4. Check [GETTING_STARTED.md](GETTING_STARTED.md) for usage instructions
5. See [ARCHITECTURE.md](ARCHITECTURE.md) for implementation details
