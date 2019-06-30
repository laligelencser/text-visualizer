const path = require('path');

module.exports = {
  entry: './src/index.js',
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    stats: "errors-only",
    host: process.env.HOST,
    port: process.env.PORT,
    open: true,
    overlay: true,
  },
  module: {
    rules: [
      {
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};