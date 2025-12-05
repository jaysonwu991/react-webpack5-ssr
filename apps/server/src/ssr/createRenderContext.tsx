import { createElement } from "react";

import RootApp from "@webapp/app/RootApp";
import type { AppBootstrapData } from "@shared/types/appData";

export type ClientManifest = Record<string, string[]>;

const CLIENT_ENTRY = "apps/webapp/src/entry-client.tsx";

export function buildRenderContext(
  _url: string,
  bootstrapData: AppBootstrapData,
  manifest?: ClientManifest
) {
  const preloadLinks = manifest
    ? renderPreloadLinks(manifest, CLIENT_ENTRY)
    : "";

  return {
    element: createElement(RootApp, bootstrapData.components),
    preloadLinks,
  };
}

function renderPreloadLinks(manifest: ClientManifest, entry: string) {
  const seen = new Set<string>();
  let links = "";

  const files = manifest[entry] ?? manifest[`/${entry}`] ?? [];

  for (const file of files) {
    if (seen.has(file)) continue;
    seen.add(file);

    if (file.endsWith(".js")) {
      links += `<link rel="modulepreload" crossorigin href="${file}">`;
    } else if (file.endsWith(".css")) {
      links += `<link rel="stylesheet" href="${file}">`;
    }
  }

  return links;
}
