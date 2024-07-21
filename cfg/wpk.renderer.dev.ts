import * as path from 'path'
import * as webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpackPaths from './utils/wpk.paths'

const config: webpack.Configuration = {
  mode: 'development',
  target: ['web', 'electron-renderer'],
  devtool: 'inline-source-map',
  entry: path.join(webpackPaths.srcRendererPath, 'index.js'),
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: path.join('index.html'),
      template: path.join(webpackPaths.srcRendererPath, 'index.ejs')
    })
  ]
}

export default config
