const { SUPPORTED_BROWSERS } = require('./constants');

module.exports = {
  extends: require.resolve('./babel.common.config.js'),
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: SUPPORTED_BROWSERS
        },
        modules: 'commonjs'
      }
    ]
  ],
  plugins: ['babel-plugin-dynamic-import-node']
};
