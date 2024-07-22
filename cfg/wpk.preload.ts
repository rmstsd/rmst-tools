import path from 'path'
import webpack from 'webpack'
import wpkPaths from './utils/wpk.paths'

export default function getPreloadWpkCfg(): webpack.Configuration {
  return {
    mode: 'development',
    target: 'electron-preload',
    devtool: 'inline-source-map',
    entry: path.join(wpkPaths.srcPreloadPath, 'index.ts'),
    output: {
      path: wpkPaths.outputPreloadPath,
      filename: 'index.js',
      clean: true
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
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
