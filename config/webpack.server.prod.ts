const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  name: 'server',
  target: 'node',
  mode: 'production',
  devtool: 'source-map',

  entry: {
    server: path.resolve(__dirname, '../apps/server/src/index.ts'),
  },

  output: {
    path: path.resolve(__dirname, '../dist/server'),
    filename: '[name].js',
    clean: true,
  },

  externals: [nodeExternals()],

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
              ['@babel/preset-env', { targets: { node: 'current' } }],
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            plugins: ['@loadable/babel-plugin'],
          },
        },
      },
      {
        test: /\.s?css$/,
        use: 'null-loader',
      },
      {
        test: /\.html$/,
        type: 'asset/source',
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },

  node: {
    __dirname: false,
    __filename: false,
  },
};

module.exports = config;
