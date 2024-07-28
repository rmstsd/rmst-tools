import webpack from 'webpack'
import { merge } from 'webpack-merge'

import getMainWpkCfg from '../wpk.main'
import TerserPlugin from 'terser-webpack-plugin'

export default function getMainCfgProd() {
  const config: webpack.Configuration = {
    mode: 'production',
    devtool: false,
    optimization: {
      minimizer: [new TerserPlugin({ extractComments: false })]
    }
  }

  const wpkMainProdConfig = merge(getMainWpkCfg(), config)

  return wpkMainProdConfig
}
