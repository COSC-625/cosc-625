import { resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
  entry: {
    index: resolve(__dirname, './client/src/index.js'),
    game: resolve(__dirname, './client/src/game.js')
  },
  mode: 'development',
  devtool: 'inline-source-map',
  target: 'web',
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/src/index.html',
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: './client/src/game.html',
      inject: true,
      filename: 'game.html'
    }),
    new MiniCssExtractPlugin({
      filename: "style.css"
    })
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
    path: resolve(__dirname, './client/dist'),
    publicPath: './',
    filename: '[name].bundle.js',
    assetModuleFilename: 'images/[name][ext][query]'
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  }
}
