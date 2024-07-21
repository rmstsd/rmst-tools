import webpack from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'

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
  },
  optimization: {
    minimizer: [new TerserPlugin({ extractComments: false })]
  }
}

const wpkRendererProd = merge(baseConfig, config)

export default wpkRendererProd
