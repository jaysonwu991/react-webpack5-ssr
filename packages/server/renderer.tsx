import path from "path";
import { renderToString } from "react-dom/server";
import { ChunkExtractor } from "@loadable/server";

import App from "../client/App";
import getHtml from "./template";


export default () => {
  const loadableJson = path.resolve(__dirname, "../client/loadable-stats.json");

  const extractor = new ChunkExtractor({
    statsFile: loadableJson,
    entrypoints: ["client"],
  });

  const appProps = { name: "Jayson" };
  
  const appContent = renderToString(
    extractor.collectChunks(<App {...appProps} />)
  );

  const htmlData = {
    content: appContent,
    extractor,
  };

  const html = getHtml(htmlData);

  return html;
};
