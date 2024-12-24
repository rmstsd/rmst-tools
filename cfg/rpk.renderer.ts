import path from 'path'
import { defineConfig, RsbuildConfig } from '@rsbuild/core'
import { pluginLess } from '@rsbuild/plugin-less'
import { pluginReact } from '@rsbuild/plugin-react'
import tailwindcss from 'tailwindcss'

import wpkPaths from './utils/wpk.paths'
import { getWebpackResolveAlias } from './utils'
import { Default_Port } from './utils/constants'

export default function getRenderRpkCfg(env = {}): RsbuildConfig {
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
      },
      legalComments: 'none'
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
