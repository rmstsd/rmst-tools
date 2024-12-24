import path from 'path'
import { pluginLess } from '@rsbuild/plugin-less'
import { pluginReact } from '@rsbuild/plugin-react'
import wpkPaths from './utils/wpk.paths'
import { getWebpackResolveAlias } from './utils'
import { defineConfig, RsbuildConfig, Rspack } from '@rsbuild/core'
import { Default_Port } from './utils/constants'
import tailwindcss from 'tailwindcss'

// function getRendererWpkCfg(env = {}): Rspack.Configuration {
//   const isDev = process.env.NODE_ENV === 'development'
//   const isProd = process.env.NODE_ENV === 'production'

//   return {
//     mode: isDev ? 'development' : 'production',
//     target: ['web', 'electron-renderer'],
//     devtool: isDev ? 'cheap-module-source-map' : false, // cheap-module-source-map
//     entry: path.join(wpkPaths.srcRendererPath, 'index.ts'),
//     output: isProd
//       ? {
//           filename: 'index.js',
//           path: wpkPaths.outputRendererPath,
//           publicPath: './',
//           clean: true
//         }
//       : undefined,

//     resolve: {
//       extensions: ['.tsx', '.ts', '.js'],
//       alias: getWebpackResolveAlias()
//     },
//     stats: 'errors-only',
//     module: {
//       rules: [
//         {
//           test: /\.[jt]sx?$/,
//           exclude: /node_modules/,
//           use: [
//             {
//               loader: 'babel-loader',
//               options: {
//                 presets: [['react-app', { flow: false, typescript: true, runtime: 'automatic' }]]
//               }
//             }
//           ]
//         },
//         {
//           test: /\.css$/i,
//           use: ['style-loader', { loader: 'css-loader' }]
//         },
//         {
//           test: /\.less$/i,
//           use: [
//             'style-loader',
//             'css-loader',
//             {
//               loader: 'postcss-loader',
//               options: {
//                 postcssOptions: { plugins: ['tailwindcss', 'autoprefixer'] }
//               }
//             },
//             'less-loader'
//           ]
//         }
//       ]
//     },
//     plugins: [
//       new HtmlWebpackPlugin({
//         filename: path.join('index.html'),
//         template: path.join(wpkPaths.srcRendererPath, 'index.ejs')
//       }),

//       isDev && new ReactRefreshWebpackPlugin({ overlay: false }),

//       new webpack.EnvironmentPlugin({ NODE_ENV: process.env.NODE_ENV, ...env })
//     ].filter(Boolean)

//     // optimization: {
//     //   minimizer: [isProd && new TerserPlugin({ extractComments: false })].filter(Boolean)
//     // }
//   }
// }

export function getRenderRsCfg(env = {}): RsbuildConfig {
  return defineConfig({
    source: {
      entry: {
        index: path.join(wpkPaths.srcRendererPath, 'index.ts')
      },
      define: env
    },
    plugins: [pluginLess(), pluginReact()],
    server: {
      port: Default_Port
    },
    dev: {
      assetPrefix: './',
      hmr: false
    },
    resolve: {
      alias: getWebpackResolveAlias()
    },
    html: {
      template: path.join(wpkPaths.srcRendererPath, 'index.ejs')
    },
    output: {
      distPath: {
        root: wpkPaths.outputRendererPath
      },
      assetPrefix: './',
      // copy: [{ from: './public', to: '' }],
      cssModules: {
        localIdentName: '[local]-[hash:base64:4]'
      }
    },
    tools: {
      postcss: {
        postcssOptions: {
          plugins: [
            tailwindcss({
              content: ['./src/**/*.{html,js,ts,jsx,tsx}']
            })
          ]
        }
      }
    }
  })
}
