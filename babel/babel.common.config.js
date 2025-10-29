module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [require.resolve('@babel/plugin-proposal-export-default-from')]
};
