import path from 'path'
import webpack from 'webpack'
import webpackPaths from './utils/wpk.paths'

const config: webpack.Configuration = {
  mode: 'development',
  target: 'electron-preload',
  devtool: 'inline-source-map',
  entry: path.join(webpackPaths.srcPreloadPath, 'index.ts'),
  output: {
    path: webpackPaths.outputPreloadPath,
    filename: 'index.js',
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
}

export default config
