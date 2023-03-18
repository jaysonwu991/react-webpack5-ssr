const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const LoadablePlugin = require("@loadable/webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const BUILD_DIR = path.resolve(__dirname, "../dist/client");

module.exports = {
  name: 'client',
  target: "web",
  mode: "production",
  stats: 'errors-warnings',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  entry: {
    client: "./packages/client/index.tsx",
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.(tsx|ts|js|jsx|mjs)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(sass|s?css)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  output: {
    path: BUILD_DIR,
    publicPath: "/client/",
    filename: "static/js/[name].[chunkhash:8].js",
    chunkFilename: "static/js/[name].[chunkhash:8].js",
    assetModuleFilename: "assets/[hash][ext][query]",
  },
  plugins: [
    new LoadablePlugin(),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[chunkhash:8].css",
      ignoreOrder: true,
    }),
  ],
  optimization: {
    runtimeChunk: "single", // creates a runtime file to be shared for all generated chunks.
    splitChunks: {
      chunks: "all", // This indicates which chunks will be selected for optimization.
      automaticNameDelimiter: "-",
      cacheGroups: {
        vendor: {
          // to convert long vendor generated large name into vendor.js
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
};
