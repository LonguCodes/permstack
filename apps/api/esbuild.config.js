const { esbuildDecorators } = require('esbuild-decorators');

module.exports = {
  plugins: [esbuildDecorators({})],
  sourcemap: true,
  outExtension: {
    '.js': '.js',
  },
};
