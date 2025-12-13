import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Silence Sass legacy JS API deprecation until tooling adopts the new API.
process.env.SASS_SILENCE_DEPRECATIONS = "legacy-js-api";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist/webapp",
    ssrManifest: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },
  resolve: {
    alias: {
      "@webapp": path.resolve(__dirname, "apps/webapp/src"),
      "@server": path.resolve(__dirname, "apps/server/src"),
      "@shared": path.resolve(__dirname, "libs/shared/src"),
    },
  },
});
