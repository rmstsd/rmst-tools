import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import wpkPaths from './utils/wpk.paths'
import { getWebpackResolveAlias } from './utils'

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

export default function getRendererWpkCfg(NODE_ENV): webpack.Configuration {
  const isDev = NODE_ENV === 'development'
  const isProd = NODE_ENV === 'production'

  return {
    mode: 'development',
    target: ['web', 'electron-renderer'],
    devtool: 'cheap-module-source-map', // cheap-module-source-map
    entry: path.join(wpkPaths.srcRendererPath, 'index.ts'),
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: getWebpackResolveAlias()
    },
    stats: 'errors-only',
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [['react-app', { flow: false, typescript: true, runtime: 'automatic' }]]
              }
            }
          ]
        },
        {
          test: /\.css$/i,
          use: ['style-loader', { loader: 'css-loader' }]
        },
        {
          test: /\.less$/i,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: { plugins: ['tailwindcss', 'autoprefixer'] }
              }
            },
            'less-loader'
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: path.join('index.html'),
        template: path.join(wpkPaths.srcRendererPath, 'index.ejs')
      }),

      isDev && new ReactRefreshWebpackPlugin({ overlay: false })
    ].filter(Boolean)
  }
}
