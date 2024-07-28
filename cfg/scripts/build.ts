import picocolors from 'picocolors'
import { webpack } from 'webpack'

import getMainWpkCfg from '../wpk.main'
import getRendererWpkCfg from '../wpk.renderer'

import wpkPaths from '../utils/wpk.paths'
import { loadEnv } from '../env'

export async function build(options) {
  process.env.NODE_ENV = 'production'

  const env = loadEnv(options.mode, wpkPaths.envPath)

  await buildRenderer(env)
  await buildMain(env)
}

function buildRenderer(env) {
  console.log(picocolors.yellow('building renderer'))
  const compiler = webpack(getRendererWpkCfg(env))
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || stats?.hasErrors()) {
        console.error(stats?.toJson({ all: false, warnings: true, errors: true }))
        return
      }

      resolve(undefined)
    })
  })
}

function buildMain(env) {
  console.log(picocolors.yellow('building main'))
  const compiler = webpack(getMainWpkCfg(env))
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || stats?.hasErrors()) {
        console.error('-- Main 打包出错', stats?.toJson({ all: false, warnings: true, errors: true }))
        return
      }

      resolve(undefined)
    })
  })
}
