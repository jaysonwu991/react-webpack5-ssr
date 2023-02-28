import dotenv from "dotenv";
import express from "express";
import webpack from "webpack";
import compression from "compression";
import WebpackDevMiddleware from "webpack-dev-middleware";
import WebpackHotMiddleware from "webpack-hot-middleware";

import renderer from "./renderer";

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "development") {
  const webpackConfig = require("../../config/dev/webpack.dev.client.js");
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
app.use(express.static("dist"));

app.get("*", (_req: express.Request, res: express.Response) => {
  try {
    res.send(renderer());
  } catch (err) {
    console.log("error in rendering server side:", err);
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
