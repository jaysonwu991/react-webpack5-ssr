import { renderApp } from "@webapp/app/renderApp";
import type { AppState } from "@shared/types/appState";

export type ClientManifest = Record<string, string[]>;

const CLIENT_ENTRY = "apps/webapp/src/entry-client.tsx";

export async function buildRenderContext(
  state: AppState,
  manifest?: ClientManifest
) {
  const preloadLinks = manifest
    ? renderPreloadLinks(manifest, CLIENT_ENTRY)
    : "";

  return {
    element: renderApp(state),
    appState: state,
    statusCode: state.route === "not-found" ? 404 : 200,
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
