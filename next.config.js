const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const withSass = require('@zeit/next-sass');

module.exports = withSass({
  cssModules: true,
  webpack: (config) => {
    const newConfig = { ...config };
    newConfig.plugins = [
      ...config.plugins,
      new FilterWarningsPlugin({
        exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
      }),
    ];
    return newConfig;
  },
});