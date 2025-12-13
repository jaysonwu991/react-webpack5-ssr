import fs from "fs";
import path from "path";
import express from "express";
import compression from "compression";
import serialize from "serialize-javascript";
import type { ViteDevServer } from "vite";
import { pathToFileURL } from "url";
import { renderToPipeableStream } from "react-dom/server";
import type { ReactElement } from "react";
import { Transform } from "stream";

import {
  buildCalloutState,
  buildGreetingState,
  buildHomeState,
  buildNotFoundState,
} from "./routes/appRoutes";
import type { AppState } from "@shared/types/appState";

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production";
const SSR_ENTRY_BASENAME = "createRenderContext";
const SSR_ENTRY_SOURCE = "/apps/webapp/src/ssr/createRenderContext.ts";
const SSR_MANIFEST_LOCATIONS = [
  "dist/webapp/.vite/ssr-manifest.json",
  "dist/webapp/ssr-manifest.json",
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

type ClientManifest = Record<string, string[]>;

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
      resolveFromRoot("dist/webapp/index.html"),
      "utf-8"
    );

    ssrManifest = readClientManifest();

    app.use(
      "/assets",
      express.static(resolveFromRoot("dist/webapp/assets"), { index: false })
    );
    app.use(express.static(resolveFromRoot("dist/webapp"), { index: false }));
  }

  type RenderContext = {
    element: ReactElement;
    preloadLinks: string;
    appState: AppState;
    statusCode: number;
  };
  type RenderContextBuilder = (
    state: AppState,
    manifest?: ClientManifest
  ) => Promise<RenderContext> | RenderContext;

  const renderRequest = async (state: AppState, req: express.Request, res: express.Response) => {
    const requestedUrl = req.originalUrl;

    try {
      let template: string;
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

      const { element, preloadLinks, appState, statusCode } =
        await buildRenderContext(state, ssrManifest);

      const templateWithState = template
        .replace("<!--preload-links-->", preloadLinks)
        .replace(
          "<!--app-state-->",
          `<script>window.__APP_STATE__=${serialize(appState, {
            isJSON: true,
          })}</script>`
        );

      const [htmlStart, htmlEnd] = templateWithState.split("<!--app-html-->");

      res.status(statusCode).setHeader("Content-Type", "text/html");

      const { pipe } = renderToPipeableStream(element, {
        onShellReady() {
          res.write(htmlStart);
          const transformStream = new Transform({
            transform(chunk: Buffer, _encoding: string, callback: () => void) {
              this.push(chunk);
              callback();
            },
            final(callback: () => void) {
              this.push(htmlEnd);
              callback();
            },
          });

          transformStream.pipe(res);
          pipe(transformStream);
        },
        onShellError(error) {
          console.error("Shell error:", error);
          res.status(500).end((error as Error).stack);
        },
        onError(error) {
          console.error("Stream error:", error);
        },
      });
    } catch (err) {
      if (!isProduction && vite) {
        vite.ssrFixStacktrace(err as Error);
      }

      console.error("Error during SSR:", err);
      res.status(500).end((err as Error).stack);
    }
  };

  const router = express.Router();
  router.get("/", (req, res) => renderRequest(buildHomeState(), req, res));
  router.get("/hello", (req, res) =>
    renderRequest(buildGreetingState(undefined), req, res)
  );
  router.get("/hello/:name", (req, res) =>
    renderRequest(buildGreetingState(req.params.name), req, res)
  );
  router.get("/callout", (req, res) =>
    renderRequest(buildCalloutState(), req, res)
  );
  router.use((req, res) => renderRequest(buildNotFoundState(), req, res));

  app.use(router);

  return { app };
}

createServer().then(({ app }) => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}: http://localhost:${PORT}`);
  });
});
