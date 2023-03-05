const path = require("path");
const { merge } = require("webpack-merge");
const webpackNodeExternals = require("webpack-node-externals");

const baseConfig = require("./webpack.config");
const BUILD_DIR = path.resolve(__dirname, "../dist/server");

const serverConfig = {
  name: "server",
  target: "node",
  mode: "development",
  entry: {
    server: "./packages/server/index.tsx",
  },
  resolve: {
    ...baseConfig.resolve,
  },
  module: {
    ...baseConfig.module,
    rules: [
      {
        test: /\.(sass|s?css)$/,
        use: ["css-loader", "sass-loader"],
      },
    ],
  },
  output: {
    path: BUILD_DIR,
    filename: "[name].js",
    libraryTarget: "commonjs2",
    chunkFilename: "chunks/[name].js",
    devtoolModuleFilenameTemplate: (info) =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, "/"),
    assetModuleFilename: "assets/[hash][ext][query]",
  },
  externals: [webpackNodeExternals()],
};

module.exports = merge(baseConfig, serverConfig);
