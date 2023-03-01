const path = require('path');
const { merge } = require('webpack-merge');
const webpackNodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const baseConfig = require('./webpack.config.js');
const ROOT_DIR = path.resolve(__dirname, '../');
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args);
const BUILD_DIR = resolvePath('dist');

const serverConfig = {
  name: 'server',
  target: 'node',
  mode: 'production',
  entry: {
    server: './packages/server/index.tsx',
  },
  resolve: {
    ...baseConfig.resolve,
  },
  module: {
    ...baseConfig.module,
    rules: [
      {
        test: /\.(css|less|styl|scss|sass|sss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
  ],
  output: {
    path: BUILD_DIR,
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    chunkFilename: 'chunks/[name].js',
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
  externals: [webpackNodeExternals()],
};

module.exports = merge(baseConfig, serverConfig);
