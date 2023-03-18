const path = require('path');
const webpack = require('webpack');
const LoadablePlugin = require('@loadable/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const BUILD_DIR = path.resolve(__dirname, "../dist/client");

module.exports = {
  name: 'client',
  target: 'web',
  mode: 'development',
  stats: 'errors-warnings',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  entry: {
    client: ['webpack-hot-middleware/client?reload=true&noInfo=true', './packages/client/index.tsx'],
  },
  devtool: 'inline-cheap-module-source-map',
  devServer: {
    contentBase: './dist',
    compress: true,
    historyApiFallback: true,
    hot: true,
    open: true,
  },
  output: {
    path: BUILD_DIR,
    publicPath: '/client/',
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].js',
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: (info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    assetModuleFilename: 'assets/[hash][ext][query]',
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
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new LoadablePlugin(),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[chunkhash:8].css",
      ignoreOrder: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  optimization: {
    runtimeChunk: 'single', // creates a runtime file to be shared for all generated chunks.
    splitChunks: {
      chunks: 'all', // This indicates which chunks will be selected for optimization.
      automaticNameDelimiter: '-',
      cacheGroups: {
        vendor: {
          // to convert long vendor generated large name into vendor.js
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
    minimize: false,
    minimizer: [],
  },
};
