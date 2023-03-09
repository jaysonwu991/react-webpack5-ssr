import { ReactNode } from "react";
import serialize from "serialize-javascript";
import { ChunkExtractor } from "@loadable/server";

const appProps = { name: "Jayson" };

export default ({
  content,
  extractor,
}: {
  content: ReactNode;
  extractor: ChunkExtractor;
}) => {
  return `<html lang="en">
  <head>
    <base href="/" />
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React BoilerPlate</title>
    <script>
      window.INITIAL_DATA = ${serialize({ appProps })}
    </script>
    ${extractor.getStyleTags()}
  </head>
  <body>
    <div id="root">${content}</div>
    ${extractor.getScriptTags()}
  </body>
</html>`;
};
