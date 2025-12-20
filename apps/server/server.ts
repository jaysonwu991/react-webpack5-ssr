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

import { routerConfig, type TemplateTransform } from "./routes";
import { CLIENT_ENTRY } from "@shared/constants/ssrEntry";
import type { AppState } from "@shared";

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production";
const SSR_ENTRY_BASENAME = "render";
const SSR_ENTRY_SOURCE = "/apps/webapp/render.tsx";
const CLIENT_MANIFEST_LOCATIONS = [
  "dist/webapp/.vite/manifest.json",
  "dist/webapp/manifest.json",
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

type ManifestEntry = {
  file: string;
  name?: string;
  src?: string;
  isEntry?: boolean;
  css?: string[];
  assets?: string[];
};

type ClientManifest = Record<string, ManifestEntry>;

const readClientManifest = (): ClientManifest | undefined => {
  for (const manifestPath of CLIENT_MANIFEST_LOCATIONS) {
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
  let ssrManifest: ClientManifest | undefined;

  const productionTemplateCache = new Map<string, string>();
  const DEFAULT_DEV_TEMPLATE = "index.html";
  const DEFAULT_PROD_TEMPLATE = "dist/webapp/index.html";

  const resolveTemplateFilePath = (override?: string) => {
    if (override) {
      // Custom templates are in apps/server/templates/
      return resolveFromRoot('apps/server/templates', override);
    }
    return resolveFromRoot(
      isProduction ? DEFAULT_PROD_TEMPLATE : DEFAULT_DEV_TEMPLATE
    );
  };

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");

    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    app.use(vite.middlewares);
  } else {
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

  const applyRouteTemplate = async (
    template: string,
    transform: TemplateTransform | undefined,
    req: express.Request
  ) => (transform ? await transform(template, req) : template);

  const renderEntryScripts = (manifest?: ClientManifest) => {
    if (manifest) {
      const htmlEntry = manifest["index.html"];
      if (htmlEntry?.file) {
        return `<script type="module" crossorigin src="/${htmlEntry.file}"></script>`;
      }
    }
    return `<script type="module" src="/${CLIENT_ENTRY}"></script>`;
  };

  const removeDevEntryScriptTags = (template: string) =>
    template.replace(
      /<script\b[^>]*data-entry=["']?true["']?[^>]*><\/script>\s*/gi,
      ""
    );

  const injectEntryScripts = (template: string, scripts: string) => {
    if (template.includes("<!--entry-scripts-->")) {
      return template.replace("<!--entry-scripts-->", scripts);
    }

    if (template.includes("</head>")) {
      return template.replace("</head>", `${scripts}</head>`);
    }

    return `${scripts}${template}`;
  };

  const renderRequest = async (
    state: AppState,
    req: express.Request,
    res: express.Response,
    templatePath?: string,
    templateTransform?: TemplateTransform
  ) => {
    const requestedUrl = req.originalUrl;

    try {
      let template: string;
      let buildRenderContext: RenderContextBuilder;

      const templateFilePath = resolveTemplateFilePath(templatePath);

      if (!isProduction) {
        const rawTemplate = fs.readFileSync(templateFilePath, "utf-8");
        template = await vite!.transformIndexHtml(
          requestedUrl,
          rawTemplate
        );

        const ssrModule = await vite!.ssrLoadModule(SSR_ENTRY_SOURCE);
        buildRenderContext = ssrModule.buildRenderContext;
      } else {
        if (!productionTemplateCache.has(templateFilePath)) {
          productionTemplateCache.set(
            templateFilePath,
            fs.readFileSync(templateFilePath, "utf-8")
          );
        }

        template = productionTemplateCache.get(templateFilePath)!;
        const ssrModule = await import(resolveBuiltSsrModuleUrl());
        buildRenderContext = ssrModule.buildRenderContext;
      }

      template = await applyRouteTemplate(template, templateTransform, req);
      template = removeDevEntryScriptTags(template);
      template = injectEntryScripts(
        template,
        renderEntryScripts(ssrManifest)
      );

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
  routerConfig.routes.forEach(
    (
      { path: routePath, buildState, method, templatePath, templateTransform }
    ) => {
      const httpMethod = method ?? "get";
      router[httpMethod](routePath, (req, res) =>
        renderRequest(
          buildState(req),
          req,
          res,
          templatePath,
          templateTransform
        )
      );
    }
  );

  router.use((req, res) => renderRequest(routerConfig.notFound(), req, res));

  app.use(router);

  return { app };
}

createServer().then(({ app }) => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}: http://localhost:${PORT}`);
  });
});
