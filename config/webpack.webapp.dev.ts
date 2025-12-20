const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');

const config = {
  name: 'webapp',
  target: 'web',
  mode: 'development',
  devtool: 'source-map',

  entry: {
    main: path.resolve(__dirname, '../apps/webapp/src/index.tsx'),
  },

  output: {
    path: path.resolve(__dirname, '../dist/webapp'),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/static/',
    clean: true,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@shared': path.resolve(__dirname, '../libs/shared/src'),
    },
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            plugins: ['@loadable/babel-plugin'],
          },
        },
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].chunk.css',
    }),
    new LoadablePlugin({
      filename: 'loadable-stats.json',
      writeToDisk: true,
    }),
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
      },
    },
  },

  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300, // Delay rebuild after the first change
  },
};

module.exports = config;
