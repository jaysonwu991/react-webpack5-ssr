import path from 'path';
import { renderToString } from 'react-dom/server';
import { ChunkExtractor } from '@loadable/server';
import React from 'react';

import type { AppState } from '@react-ssr-falcon/shared';
// Import App from webapp - webpack will resolve this
// @ts-ignore - TypeScript may complain but webpack handles it
import App from '../../webapp/src/App';

export interface RenderResult {
  html: string;
  styleTags: string;
  scriptTags: string;
}

/**
 * Render React app to HTML string with loadable chunks
 */
export function renderAppToString(appState: AppState): RenderResult {
  // In development, webpack outputs to dist/webapp
  // In production build, it's relative to the server bundle
  const loadableJson = process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, '../webapp/loadable-stats.json')
    : path.resolve(__dirname, '../../../dist/webapp/loadable-stats.json');

  let extractor: ChunkExtractor | null = null;
  let appHtml: string;
  let styleTags = '';
  let scriptTags = '';

  try {
    // Try to use ChunkExtractor if loadable-stats.json exists
    extractor = new ChunkExtractor({
      statsFile: loadableJson,
      entrypoints: ['main'],
    });

    appHtml = renderToString(
      extractor.collectChunks(React.createElement(App, appState.components))
    );

    styleTags = extractor.getStyleTags();
    scriptTags = extractor.getScriptTags();
  } catch (err) {
    // Fallback: render without chunk extraction
    console.warn('Loadable stats not found, rendering without chunk extraction:', err);
    appHtml = renderToString(React.createElement(App, appState.components));
  }

  return {
    html: appHtml,
    styleTags,
    scriptTags,
  };
}
