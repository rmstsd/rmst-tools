import * as path from 'path'
import * as webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'
import webpackPaths from './utils/wpk.paths'
import { getWebpackResolveAlias } from './utils'

const config: webpack.Configuration = {
  mode: 'development',
  target: 'electron-main',
  devtool: 'inline-source-map',
  entry: path.join(webpackPaths.srcMainPath, 'index.ts'),
  output: {
    path: webpackPaths.outputMainPath,
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: getWebpackResolveAlias()
  },
  externals: [nodeExternals({ allowlist: 'electron-store' })],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: {
              module: 'Commonjs'
            }
          }
        }
      }
    ]
  }
}

export default config
