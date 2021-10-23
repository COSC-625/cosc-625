import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { resolve } from 'path';

export default {
  entry: [
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
    new MiniCssExtractPlugin()
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
        test: /\.[s]css$/,
        use: [MiniCssExtractPlugin.loader, 'style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          outputPath: 'images',
          name: '[name]-[contenthash].[ext]'
        }
      }
    ]
  },
  output: {
    path: resolve(__dirname, './client/dist/'),
    publicPath: '/',
    filename: 'bundle.js'
  }
}
