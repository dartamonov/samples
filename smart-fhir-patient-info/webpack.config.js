const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    'babel-polyfill',
    path.resolve('source/index.js'),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/public/',
  },
  module: {
    rules: [
      {
        test: /(\.js|\.jsx)$/,
        include: path.join(__dirname, 'source'),
        exclude: /(node_modules)/,
        use: [{loader: 'babel-loader'}, {loader: 'eslint-loader'}]
      },
      {test: /jquery/, use: {loader: 'expose?$!expose?jQuery'}},
      {test: /(\.css|\.scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', `sass-loader?${JSON.stringify({
          includePaths: ['./node_modules']
          })}`]
        })
      }
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('style.css'),
    new HtmlWebpackPlugin({
        title: 'Patient information via SMART on FHIR',
        hash: true,
        template: './source/index.html', // Load a custom template (ejs by default see the FAQ for details)
    }),
  ],
  resolveLoader: {
    modules: [
      'node_modules',
    ],
  },
};
