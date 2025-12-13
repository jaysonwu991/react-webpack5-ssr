import { renderApp } from "@webapp/app/renderApp";
import type { AppState } from "@shared/types/appState";
import { CLIENT_ENTRY } from "@shared/constants/ssrEntry";

type ManifestEntry = {
  file: string;
  name?: string;
  src?: string;
  isEntry?: boolean;
  css?: string[];
  assets?: string[];
};

export type ClientManifest = Record<string, ManifestEntry>;

export async function buildRenderContext(
  state: AppState,
  manifest?: ClientManifest
) {
  const preloadLinks = manifest ? renderPreloadLinks(manifest) : "";

  return {
    element: renderApp(state),
    appState: state,
    statusCode: state.route === "not-found" ? 404 : 200,
    preloadLinks,
  };
}

function renderPreloadLinks(manifest: ClientManifest) {
  const seen = new Set<string>();
  let links = "";

  // Find the HTML entry point
  const htmlEntry = manifest["index.html"];
  if (!htmlEntry) return links;

  // Add the main JS file as modulepreload
  if (htmlEntry.file && !seen.has(htmlEntry.file)) {
    seen.add(htmlEntry.file);
    links += `<link rel="modulepreload" crossorigin href="/${htmlEntry.file}">`;
  }

  // Add CSS files as stylesheets
  if (htmlEntry.css) {
    for (const cssFile of htmlEntry.css) {
      if (seen.has(cssFile)) continue;
      seen.add(cssFile);
      links += `<link rel="stylesheet" href="/${cssFile}">`;
    }
  }

  // Add other assets if needed
  if (htmlEntry.assets) {
    for (const asset of htmlEntry.assets) {
      if (seen.has(asset)) continue;
      seen.add(asset);
      // Determine asset type and add appropriate link
      if (asset.endsWith(".css")) {
        links += `<link rel="stylesheet" href="/${asset}">`;
      } else if (asset.endsWith(".js")) {
        links += `<link rel="modulepreload" crossorigin href="/${asset}">`;
      }
    }
  }

  return links;
}
