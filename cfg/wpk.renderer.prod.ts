import webpack from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import { merge } from 'webpack-merge'

import webpackPaths from './utils/wpk.paths'
import getRendererWpkCfg from './wpk.renderer.dev'

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

const wpkRendererProd = merge(getRendererWpkCfg(process.env.NODE_ENV), config)

export default wpkRendererProd
