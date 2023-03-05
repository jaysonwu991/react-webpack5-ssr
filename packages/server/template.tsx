import { ReactNode } from "react";
import serialize from "serialize-javascript";
import { ChunkExtractor } from "@loadable/server";

const app1Props = { name: "Jayson" };

export default ({
  contents,
  extractor,
}: {
  contents: ReactNode[];
  extractor: ChunkExtractor;
}) => {
  return `<html lang="en">
  <head>
    <base href="/" />
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React BoilerPlate</title>
    ${extractor.getStyleTags()}
  </head>
  <body>
    <div id="root">
      <div id="App1">${contents[0]}</div>
      <div id="App2">${contents[1]}</div>
    </div>
    <script>
      window.INITIAL_DATA = ${serialize({ app1Props })}
    </script>
    ${extractor.getScriptTags()}
  </body>
</html>`;
};
