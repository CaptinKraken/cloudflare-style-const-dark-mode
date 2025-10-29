module.exports = {
  extends: require.resolve('./babel.common.config.js'),
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ]
  ],
  plugins: ['babel-plugin-dynamic-import-node']
};
