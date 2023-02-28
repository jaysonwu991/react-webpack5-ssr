import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";
import { ChunkExtractor } from "@loadable/server";

import getHtml from "./template";
import App from "../client/App";

export default () => {
  const loadableJson = path.resolve(__dirname, "./loadable-stats.json");

  const extractor = new ChunkExtractor({
    statsFile: loadableJson,
    entrypoints: ["client"],
  });

  const content = renderToString(
    extractor.collectChunks(React.createElement(App))
  );

  const htmlData = {
    children: content,
    extractor,
  };

  const html = getHtml(htmlData);

  return html;
};
