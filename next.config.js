const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = {
  target: 'serverless',
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new InjectManifest({
        swSrc: './src/sw.ts',
        swDest: `${__dirname}/public/sw.js`,
        exclude: [
          /^build-manifest\.json$/i,
          /^react-loadable-manifest\.json$/i,
          /\/_error\.js$/i,
          /\.js\.map$/i,
        ],
        modifyURLPrefix: {
          'static/': '/_next/static/'
        },
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 // 5MB
      })
    );

    return config;
  }
};
