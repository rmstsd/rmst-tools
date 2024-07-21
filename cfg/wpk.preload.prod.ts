import webpack from 'webpack'

import { merge } from 'webpack-merge'

import baseConfig from './wpk.preload'

const config: webpack.Configuration = {
  mode: 'production',
  devtool: false
}

const wpkPreloadProdConfig = merge(baseConfig, config)

export default wpkPreloadProdConfig