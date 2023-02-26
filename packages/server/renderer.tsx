import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";
import { ChunkExtractor, ChunkExtractorManager } from "@loadable/server";

import getHtml from "./template";
import App from "../client/App";

export default () => {
  const loadableJson = path.resolve(__dirname, "./loadable-stats.json");

  const extractor = new ChunkExtractor({
    statsFile: loadableJson,
    entrypoints: ["client"],
  });

  const content = renderToString(
    // @ts-ignore
    <ChunkExtractorManager extractor={extractor}>
      <App />
    </ChunkExtractorManager>
  );

  const htmlData = {
    children: content,
    extractor,
  };

  const html = getHtml(htmlData);

  return html;
};
