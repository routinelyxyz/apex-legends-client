const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const withSass = require('@zeit/next-sass');
const withWorkbox = require('next-workbox');
const compose = require('next-compose');
const withPlugins = require('next-compose-plugins');
const nextOffline = require('next-offline') 
// const withOffline = require('next-offline');
const NextWorkboxWebpackPlugin = require('next-workbox-webpack-plugin');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

const CDN_URL = 'https://api.apex-legends.win';

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
      {
        urlPattern: CDN_URL + '/items/.*',
        handler: 'cacheFirst'
      },
      {
        urlPattern: CDN_URL + '/legends/.*',
        handler: 'cacheFirst'
      },
      {
        urlPattern: CDN_URL + '/leaderboards/.*',
        handler: 'staleWhileRevalidate'
      }
    ]
  },
}

const workbox = {
  runtimeCaching: [
    {
      urlPattern: 'http://localhost:4000/stats/pc/rockalone',
      handler: 'cacheFirst'
    }
  ]
}

module.exports = withPlugins(
  [
    [withSass, { cssModules: true }],
    [nextOffline, nextConfig]
  ],
  {
    target: 'serverless',
    webpack(config, { isServer, dev, buildId, config: { distDir }}) {
      const plugins = [...config.plugins];

      if (false && !isServer && !dev) {
        config.plugins.push(
          new NextWorkboxWebpackPlugin({ distDir, buildId, ...workbox })
        );
      }

      plugins.push(
        new FilterWarningsPlugin({
          exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
        })
      );

      return {
        ...config,
        plugins
      }
    }
  }
);

function moduleExists(name) {
  try {
    return require.resolve(name);
  } catch (err) {
    return false;
  }
}