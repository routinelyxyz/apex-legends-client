const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const withSass = require('@zeit/next-sass');
const withWorkbox = require('next-workbox');
const compose = require('next-compose');

module.exports = compose([
  [withSass, { cssModules: true }],
  [withWorkbox, {
    workbox: { registerSW: true }
  }],
  {
    webpack: config => ({
      ...config,
      plugins: [
        ...config.plugins,
        new FilterWarningsPlugin({
          exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
        })
      ]
    })
  }
]);