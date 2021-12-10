import { resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
  context: resolve(__dirname, './'),
  // Entry defines the "chunks" that get bundled into every generated HTML page.
  // We can exclude chunks from loading on specific pages using excludeChunks.
  entry: {
    // Styles chunk.
    index:  './client/src/index.js',
    // Chat chunk.
    chat:   './client/src/chatBundle.js',
    // mpGameLogic chunk.
    mpgame: './client/src/mpGame.js',
    // spGameLogic chunk.
    spgame: './client/src/spGame.js'
  },
  mode: 'production',
  target: 'web',
  plugins: [
    // Landing page.
    new HtmlWebpackPlugin({
      template: './client/src/index.html',
      title: 'Home',
      inject: 'body',
      favicon: './images/favicon.png',
      // Base page is only styles.
      excludeChunks: [
        'chat',
        'mpgame',
        'spgame'
      ]
    }),
    // Lobby.
    new HtmlWebpackPlugin({
      template: './client/src/lobby.html',
      inject: 'body',
      title: 'Lobby',
      filename: 'lobby.html',
      favicon: './images/favicon.png',
      // Lobby excludes game logic files.
      excludeChunks: [
        'mpgame',
        'spgame'
      ]
    }),
    // Single-Player Game board.
    new HtmlWebpackPlugin({
      template: './client/src/spGame.html',
      inject: 'body',
      title: 'Single Player Solitaire',
      filename: 'spGame.html',
      favicon: './images/favicon.png',
      // SP Game excludes MP Game logic.
      excludeChunks: [
        'mpgame'
      ]
    }),
    // Multi-Player Game board.
    new HtmlWebpackPlugin({
      template: './client/src/mpGame.html',
      inject: 'body',
      title: 'MultiPlayer Solitaire',
      filename: 'mpGame.html',
      favicon: './images/favicon.png',
      // MP Game excludes SP Game logic.
      excludeChunks: [
        'spgame'
      ]
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
    assetModuleFilename: 'images/[name][ext][query]'
  }
}
