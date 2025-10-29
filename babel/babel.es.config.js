module.exports = {
  extends: require.resolve('./babel.common.config.js'),
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true // target browsers that support ES Modules
        },
        modules: false // preserve ES modules
      }
    ]
  ]
};
