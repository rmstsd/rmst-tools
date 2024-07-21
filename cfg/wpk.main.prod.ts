import * as webpack from 'webpack'

import { merge } from 'webpack-merge'

import baseConfig from './wpk.main'

const config: webpack.Configuration = {
  mode: 'production',
  devtool: false,
  watch: false
}

const wpkMainProdConfig = merge(baseConfig, config)

export default wpkMainProdConfig
