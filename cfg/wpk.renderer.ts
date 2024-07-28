import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

import wpkPaths from './utils/wpk.paths'
import { getWebpackResolveAlias } from './utils'

export default function getRendererWpkCfg(env = {}): webpack.Configuration {
  const isDev = process.env.NODE_ENV === 'development'
  const isProd = process.env.NODE_ENV === 'production'

  return {
    mode: isDev ? 'development' : 'production',
    target: ['web', 'electron-renderer'],
    devtool: isDev ? 'cheap-module-source-map' : false, // cheap-module-source-map
    entry: path.join(wpkPaths.srcRendererPath, 'index.ts'),
    output: isProd
      ? {
          filename: 'index.js',
          path: wpkPaths.outputRendererPath,
          publicPath: './',
          clean: true
        }
      : undefined,

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

      isDev && new ReactRefreshWebpackPlugin({ overlay: false }),

      new webpack.EnvironmentPlugin({ NODE_ENV: process.env.NODE_ENV, ...env })
    ].filter(Boolean),

    optimization: {
      minimizer: [isProd && new TerserPlugin({ extractComments: false })].filter(Boolean)
    }
  }
}
