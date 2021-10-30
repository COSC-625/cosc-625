import { resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
const webpack = require('webpack');


export default {
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true',
    resolve(__dirname, './client/src/index.js')
  ],
  mode: 'development',
  devtool: 'inline-source-map',
  target: 'web',
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/src/index.html',
      inject: true
    }),
    new MiniCssExtractPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader,
              'css-loader',
              'sass-loader'
        ]
      },
      {
        test: /\.(?:ico|png|jpeg|jpg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  output: {
    path: resolve(__dirname, './client/dist/'),
    publicPath: '/',
    filename: 'bundle.js',
    assetModuleFilename: 'images/[name][ext][query]'
  }
}
