const path = require("path");
const webpackNodeExternals = require("webpack-node-externals");

const BUILD_DIR = path.resolve(__dirname, "../dist/server");

module.exports = {
  name: "server",
  target: "node",
  mode: "production",
  stats: 'errors-warnings',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  entry: {
    server: "./packages/server/index.tsx",
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts|js|jsx|mjs)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
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
    chunkFilename: "[name].js",
    assetModuleFilename: "assets/[hash][ext][query]",
  },
  externals: [webpackNodeExternals()],
};
