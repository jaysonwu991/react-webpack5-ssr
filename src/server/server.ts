import fs from "fs";
import path from "path";
import express from "express";
import compression from "compression";
import serialize from "serialize-javascript";
import type { ViteDevServer } from "vite";
import { pathToFileURL } from "url";
import { renderToPipeableStream } from "react-dom/server";
import type { ReactElement } from "react";

import type { AppBootstrapData } from "../shared/types/appData";
import type { ClientManifest } from "./ssr/createRenderContext";

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production";
const SSR_ENTRY_BASENAME = "createRenderContext";
const SSR_ENTRY_SOURCE = "/src/server/ssr/createRenderContext.tsx";
const SSR_MANIFEST_LOCATIONS = [
  "dist/client/.vite/ssr-manifest.json",
  "dist/client/ssr-manifest.json",
];
const resolveFromRoot = (...paths: string[]) =>
  path.resolve(process.cwd(), ...paths);

const resolveBuiltSsrModuleUrl = () => {
  const mjsPath = resolveFromRoot(`dist/server/${SSR_ENTRY_BASENAME}.mjs`);
  if (fs.existsSync(mjsPath)) {
    return pathToFileURL(mjsPath).href;
  }

  return pathToFileURL(
    resolveFromRoot(`dist/server/${SSR_ENTRY_BASENAME}.js`)
  ).href;
};

const readClientManifest = (): ClientManifest | undefined => {
  for (const manifestPath of SSR_MANIFEST_LOCATIONS) {
    const absolutePath = resolveFromRoot(manifestPath);
    if (fs.existsSync(absolutePath)) {
      const manifest = fs.readFileSync(absolutePath, "utf-8");
      return JSON.parse(manifest) as ClientManifest;
    }
  }

  return undefined;
};

async function createServer() {
  const app = express();

  app.use(compression());

  let vite: ViteDevServer | undefined;
  let productionTemplate: string | undefined;
  let ssrManifest: ClientManifest | undefined;

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");

    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    app.use(vite.middlewares);
  } else {
    productionTemplate = fs.readFileSync(
      resolveFromRoot("dist/client/index.html"),
      "utf-8"
    );

    ssrManifest = readClientManifest();

    app.use(
      "/assets",
      express.static(resolveFromRoot("dist/client/assets"), { index: false })
    );
    app.use(express.static(resolveFromRoot("dist/client"), { index: false }));
  }

  app.use("*", async (req, res) => {
    const requestedUrl = req.originalUrl;

    try {
      const bootstrapData: AppBootstrapData = { appProps: { name: "Jayson" } };

      let template: string;
      type RenderContext = { element: ReactElement; preloadLinks: string };
      type RenderContextBuilder = (
        url: string,
        data: AppBootstrapData,
        manifest?: ClientManifest
      ) => Promise<RenderContext> | RenderContext;

      let buildRenderContext: RenderContextBuilder;

      if (!isProduction) {
        const rawTemplate = fs.readFileSync(
          resolveFromRoot("index.html"),
          "utf-8"
        );
        template = await vite!.transformIndexHtml(requestedUrl, rawTemplate);

        const ssrModule = await vite!.ssrLoadModule(SSR_ENTRY_SOURCE);
        buildRenderContext = ssrModule.buildRenderContext;
      } else {
        template = productionTemplate!;
        const ssrModule = await import(resolveBuiltSsrModuleUrl());
        buildRenderContext = ssrModule.buildRenderContext;
      }

      const { element, preloadLinks } = await buildRenderContext(
        requestedUrl,
        bootstrapData,
        ssrManifest
      );

      const templateWithState = template
        .replace("<!--preload-links-->", preloadLinks)
        .replace(
          "<!--app-state-->",
          `<script>window.INITIAL_DATA=${serialize(bootstrapData, {
            isJSON: true,
          })}</script>`
        );

      const [htmlStart, htmlEnd] = templateWithState.split("<!--app-html-->");
      const startChunk = htmlStart ?? templateWithState;
      const endChunk = htmlEnd ?? "";

      const { pipe, abort } = renderToPipeableStream(element, {
        onShellReady() {
          res.status(200).setHeader("Content-Type", "text/html");
          res.write(startChunk);
          pipe(res);
        },
        onAllReady() {
          clearTimeout(streamTimeout);
          res.write(endChunk);
          res.end();
        },
        onShellError(err) {
          clearTimeout(streamTimeout);
          if (!isProduction && vite) {
            vite.ssrFixStacktrace(err as Error);
          }
          res.status(500).setHeader("Content-Type", "text/html");
          res.end("Internal Server Error");
          console.error("SSR shell error:", err);
        },
        onError(err) {
          if (!isProduction && vite) {
            vite.ssrFixStacktrace(err as Error);
          }
          console.error("Error during SSR stream:", err);
        },
      });

      const streamTimeout = setTimeout(() => {
        console.error("SSR streaming timed out, aborting.");
        abort();
      }, 10000);
    } catch (err) {
      if (!isProduction && vite) {
        vite.ssrFixStacktrace(err as Error);
      }

      console.error("Error during SSR:", err);
      res.status(500).end((err as Error).stack);
    }
  });

  return { app };
}

createServer().then(({ app }) => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}: http://localhost:${PORT}`);
  });
});
