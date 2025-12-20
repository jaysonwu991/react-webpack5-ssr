import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Silence Sass legacy JS API deprecation until tooling adopts the new API.
process.env.SASS_SILENCE_DEPRECATIONS = "legacy-js-api";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist/webapp",
    manifest: true,
    ssrManifest: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "libs/shared"),
    },
  },
});
