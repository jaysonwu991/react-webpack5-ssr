const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const config = {
  name: 'server',
  target: 'node',
  mode: 'development',
  devtool: 'source-map',

  entry: {
    server: path.resolve(__dirname, '../apps/server/src/index.ts'),
  },

  output: {
    path: path.resolve(__dirname, '../dist/server'),
    filename: '[name].js',
    clean: false, // Don't clean on every build to avoid triggering nodemon unnecessarily
  },

  externals: [
    nodeExternals({
      // Bundle react and react-dom for server-side rendering
      allowlist: [/^react$/, /^react-dom/, /^@loadable/],
    }),
    // Externalize webpack config files to avoid bundling them
    function ({ request }, callback) {
      if (request && request.includes('webpack.webapp.dev.ts')) {
        return callback(null, 'commonjs ' + request);
      }
      callback();
    },
  ],

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
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],

  node: {
    __dirname: false,
    __filename: false,
  },

  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300, // Delay rebuild after the first change
  },
};

module.exports = config;
