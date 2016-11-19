const webpackNodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    index: './src',
  },
  externals: [
    webpackNodeExternals(),
    'ini',
    'js-yaml',
    'toml',
    'xml2json',
  ],
  module: {
    loaders: [
      {test: /\.ts$/, loader: 'ts-loader'},
    ],
  },
  output: {
    libraryTarget: 'commonjs2',
    path: 'dist',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  target: 'node',
};
