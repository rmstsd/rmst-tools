import webpack from 'webpack'
import { merge } from 'webpack-merge'

import getPreloadWpkCfg from './wpk.preload'

const config: webpack.Configuration = {
  mode: 'production',
  devtool: false
}

const wpkPreloadProdConfig = merge(getPreloadWpkCfg(), config)

export default wpkPreloadProdConfig
