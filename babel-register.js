// Register Babel to transpile TypeScript and JSX files on the fly
require('@babel/register')({
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: ['@loadable/babel-plugin'],
  // Only transpile our source files, not node_modules
  ignore: [/node_modules/],
  // Ensure CommonJS output for Node.js
  envName: 'development',
});

// Handle CSS/SCSS imports in Node.js (ignore them for SSR)
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function (id) {
  if (id.endsWith('.css') || id.endsWith('.scss') || id.endsWith('.sass')) {
    return {};
  }
  return originalRequire.apply(this, arguments);
};
