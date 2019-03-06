const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const withSass = require('@zeit/next-sass');
const withWorkbox = require('next-workbox');
const compose = require('next-compose');
const withPlugins = require('next-compose-plugins');
const nextOffline = require('next-offline') 
// const withOffline = require('next-offline');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

const nextConfig = {
  workboxOpts: {
    swDest: 'static/service-worker.js',
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'networkFirst',
        options: {
          cacheName: 'https-calls',
          networkTimeoutSeconds: 15,
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 1 month
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
}

module.exports = withPlugins(
  [
    [withSass, { cssModules: true }],
    [nextOffline, nextConfig]
  ],
  {
    target: 'serverless',
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
);

function moduleExists(name) {
  try {
    return require.resolve(name);
  } catch (err) {
    return false;
  }
}