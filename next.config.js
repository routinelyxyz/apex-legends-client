require('core-js');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const withSass = require('@zeit/next-sass');
const withPlugins = require('next-compose-plugins');
const nextOffline = require('next-offline');
const isProduction = process.env.NODE_ENV === 'production';
const withTypescript = require('@zeit/next-typescript');

const CDN_URL = 'https://api.apex-legends.win';

const workboxConfig = {
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

const plugins = [
  [withSass, { cssModules: true }],
  [withTypescript]
];

if (isProduction) {
  plugins.push(
    [nextOffline, workboxConfig]
  );
}

module.exports = withPlugins(
  plugins,
  {
    target: isProduction ? 'serverless' : 'server',
    webpack(config) {
      const originalEntry = config.entry;

      config.entry = async () => {
        const entries = await originalEntry();
        const excludedEntries = ['reducer', 'fetchInitialStats'];

        const filteredEntries = Object.fromEntries(
          Object
            .entries(entries)
            .filter(([entryName]) => !excludedEntries.some(excludedEntry => 
              entryName.includes(excludedEntry)  
            ))
        );
        return filteredEntries;
      }

      
      const plugins = [
        ...config.plugins,
        new FilterWarningsPlugin({
          exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
        })
      ];

      return {
        ...config,
        plugins
      }
    }
  }
);