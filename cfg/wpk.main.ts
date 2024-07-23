import path from 'path'
import webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'
import wpkPaths from './utils/wpk.paths'
import { getWebpackResolveAlias } from './utils'

export default function getMainWpkCfg(): webpack.Configuration {
  return {
    mode: 'development',
    target: 'electron-main',
    devtool: 'cheap-module-source-map',
    entry: path.join(wpkPaths.srcMainPath, 'index.ts'),
    output: {
      path: wpkPaths.outputMainPath,
      filename: 'index.js',
      // libraryTarget: 'commonjs2',
      clean: true,
      library: {
        type: 'commonjs2'
      }
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      alias: getWebpackResolveAlias()
    },
    externals: [nodeExternals({ allowlist: 'electron-store' })],
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
    }
  }
}
