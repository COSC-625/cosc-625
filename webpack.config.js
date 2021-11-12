import { resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
  context: resolve(__dirname, './'),
  entry: {
    index: './client/src/index.js',
    lobby: './client/src/lobby.js',
    game: './client/src/game.js'
  },
  mode: 'production',
  target: 'web',
  plugins: [
    // Landing page.
    new HtmlWebpackPlugin({
      template: './client/src/index.html',
      title: 'Home',
      inject: 'body',
      favicon: './images/favicon.png'
    }),
    // Lobby.
    new HtmlWebpackPlugin({
      template: './client/src/lobby.html',
      inject: 'body',
      title: 'Lobby',
      filename: 'lobby.html',
      favicon: './images/favicon.png'
    }),
    // Single-Player Game board.
    new HtmlWebpackPlugin({
      template: './client/src/spGame.html',
      inject: 'body',
      title: 'Single Player Solitaire',
      filename: 'spGame.html',
      favicon: './images/favicon.png'
    }),
    // Multi-Player Game board.
    new HtmlWebpackPlugin({
      template: './client/src/mpGame.html',
      inject: 'body',
      title: 'MultiPlayer Solitaire',
      filename: 'mpGame.html',
      favicon: './images/favicon.png'
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
    publicPath: '/',
    filename: '[name].js',
    assetModuleFilename: 'images/[name][ext][query]',
    clean: true
  }
}
