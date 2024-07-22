import webpack from 'webpack'
import { merge } from 'webpack-merge'

import getMainWpkCfg from './wpk.main'

const config: webpack.Configuration = {
  mode: 'production',
  devtool: false
}

const wpkMainProdConfig = merge(getMainWpkCfg(), config)

export default wpkMainProdConfig
