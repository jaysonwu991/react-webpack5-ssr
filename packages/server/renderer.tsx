import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";
import { ChunkExtractor } from "@loadable/server";

import getHtml from "./template";
import App1 from "../client/components/App1/App";
import App2 from "../client/components/App2/App";

type Props = {
  name?: string;
};

export default () => {
  const loadableJson = path.resolve(__dirname, "./client/loadable-stats.json");

  const extractor = new ChunkExtractor({
    statsFile: loadableJson,
    entrypoints: ["client", "App1", "App2"],
  });

  const app1Props = { name: "Jayson" };

  const app1Content = renderToString(
    extractor.collectChunks(
      React.createElement<Props>(App1 as React.FC, app1Props)
    )
  );
  const app2Content = renderToString(
    extractor.collectChunks(React.createElement(App2))
  );

  const htmlData = {
    contents: [app1Content, app2Content],
    extractor,
  };

  const html = getHtml(htmlData);

  return html;
};
