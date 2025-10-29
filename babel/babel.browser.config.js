const { SUPPORTED_BROWSERS } = require('./constants');

const plugins = [];

if (process.env.NODE_ENV === 'development') {
  plugins.push(['react-refresh/babel', { skipEnvCheck: true }]);
}

module.exports = {
  extends: require.resolve('./babel.common.config.js'),
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: SUPPORTED_BROWSERS
        }
      }
    ]
  ],
  plugins
};
