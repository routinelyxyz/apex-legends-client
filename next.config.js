const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const withSass = require('@zeit/next-sass');
const withPlugins = require('next-compose-plugins');
const nextOffline = require('next-offline');
const { resolve } = require('path');
const isProduction = process.env.NODE_ENV === 'production';

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

const manifest = {
  name: "Apex-Legends.win",
  short_name: "Apex-Legends.win",
  start_url: "/",
  display: "standalone",
  background_color: "#23232F",
  theme_color: "#23232F",
  description: "Apex Legends stats, leaderboards, interactive and detailed items explorer, legend details. Quick updates with live and daily match tracking.",
  icons: {
    src: resolve(process.cwd(), './assets/pwa-icon.png'),
    cache: true
  }
}

const plugins = [
  [withSass, { cssModules: true }]
]

if (isProduction) {
  plugins.push(
    [nextOffline, nextConfig]
  );
}

module.exports = withPlugins(
  [
    ...plugins
    /*
    [withBundleAnalyzer, {
      analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
      analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
      bundleAnalyzerConfig: {
        server: {
          analyzerMode: 'static',
          reportFilename: '../bundles/server.html'
        },
        browser: {
          analyzerMode: 'static',
          reportFilename: '../bundles/client.html'
        }
      }
    }]
    */
  ],
  {
    target: isProduction ? 'serverless' : 'server',
    webpack(config, { isServer, dev, buildId, config: { distDir }}) {
      
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

function moduleExists(name) {
  try {
    return require.resolve(name);
  } catch (err) {
    return false;
  }
}