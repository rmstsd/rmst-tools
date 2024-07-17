import * as path from 'path'
import * as webpack from 'webpack'
import webpackPaths from './webpack.paths'

const entry = path.join(__dirname, '../src/main/index.ts')

const config: webpack.Configuration = {
  watch: true,

  mode: 'development',
  target: 'electron-main',
  devtool: 'inline-source-map',
  entry: entry,
  output: {
    path: webpackPaths.outputMainPath,
    filename: 'index.js',
    library: {
      type: 'commonjs'
    },
    clean: true
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
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
