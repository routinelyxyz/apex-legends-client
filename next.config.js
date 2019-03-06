const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const withSass = require('@zeit/next-sass');
const withWorkbox = require('next-workbox');
const compose = require('next-compose');
const withOffline = require('next-offline');
  // ? require('next-offline')
  // : {};

module.exports = compose([
  [withSass, { cssModules: true }],
  [withOffline, {
    // workboxOpts: {}
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

function moduleExists(name) {
  try {
    return require.resolve(name);
  } catch (err) {
    return false;
  }
}