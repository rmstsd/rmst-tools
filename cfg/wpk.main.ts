import path from 'path'
import webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'

import wpkPaths from './utils/wpk.paths'
import { getWebpackResolveAlias } from './utils'

import { Rspack } from '@rsbuild/core'

export default function getMainWpkCfg(env = {}): Rspack.Configuration {
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
    externals: [nodeExternals() as any],
    // externalsPresets: { electron: true },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: [/node_modules/],
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript'
              }
            }
          },
          type: 'javascript/auto'
        }
      ]
    }
  }
}
