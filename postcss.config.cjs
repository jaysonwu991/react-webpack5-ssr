module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-properties': true,
        'custom-media-queries': true,
      },
      autoprefixer: {
        flexbox: 'no-2009',
        grid: 'autoplace',
      },
    },
  },
};
