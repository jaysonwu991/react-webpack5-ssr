import path from "path";
import express from "express";
import webpack from "webpack";
import compression from "compression";
import WebpackDevMiddleware from "webpack-dev-middleware";
import WebpackHotMiddleware from "webpack-hot-middleware";

import renderer from "./renderer";

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === "development") {
  const webpackConfig = require("../../config/webpack.client.dev.js");
  const compiler: any = webpack(webpackConfig);

  app.use(
    WebpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      serverSideRender: true,
    })
  );

  app.use(WebpackHotMiddleware(compiler));
}

// Gzip
app.use(compression());
app.use(express.static(path.join(__dirname, "../")));

app.get("*", (_req: express.Request, res: express.Response) => {
  try {
    res.send(renderer());
  } catch (err) {
    console.log("error in rendering server side:", err);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}: http://localhost:${PORT}`);
});
