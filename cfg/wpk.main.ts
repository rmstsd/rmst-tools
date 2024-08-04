import path from 'path'
import webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'
import TerserPlugin from 'terser-webpack-plugin'

import wpkPaths from './utils/wpk.paths'
import { getWebpackResolveAlias } from './utils'

export default function getMainWpkCfg(env = {}): webpack.Configuration {
  const isDev = process.env.NODE_ENV === 'development'
  const isProd = process.env.NODE_ENV === 'production'

  return {
    mode: isDev ? 'development' : 'production',
    target: 'electron-main',
    devtool: isDev ? 'cheap-module-source-map' : false,
    entry: {
      main: path.join(wpkPaths.srcMainPath, 'index.ts'),
      preload: path.join(wpkPaths.srcPreloadPath, 'index.ts')
    },
    output: {
      path: wpkPaths.outputMainPath,
      filename: '[name].js',
      clean: true,
      library: { type: 'umd' }
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      alias: getWebpackResolveAlias()
    },
    externals: [nodeExternals()],
    externalsPresets: { electron: true },
    module: {
      rules: [
        {
          test: /\.[jt]s$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['react-app', { flow: false, typescript: true }]]
            }
          }
        }
      ]
    },
    plugins: [new webpack.EnvironmentPlugin({ ...env })],
    optimization: {
      minimizer: [isProd && new TerserPlugin({ extractComments: false })].filter(Boolean)
    },
    cache: {
      type: 'filesystem'
    }
  }
}
