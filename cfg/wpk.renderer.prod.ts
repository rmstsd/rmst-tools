import * as webpack from 'webpack'

import baseConfig from './wpk.renderer.dev'

import { merge } from 'webpack-merge'
import webpackPaths from './utils/wpk.paths'

const config: webpack.Configuration = {
  mode: 'production',
  target: ['web', 'electron-renderer'],
  devtool: false,
  output: {
    filename: 'index.js',
    path: webpackPaths.outputRendererPath,
    publicPath: './',
    clean: true
  }
}

const wpkRendererProd = merge(baseConfig, config)

export default wpkRendererProd
