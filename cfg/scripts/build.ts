import picocolors from 'picocolors'

import getMainWpkCfg from '../wpk.main'
import { getRenderRsCfg } from '../wpk.renderer'

import wpkPaths from '../utils/wpk.paths'
import { loadEnv } from '../env'
import { createRsbuild, rspack } from '@rsbuild/core'

export async function build(options) {
  process.env.NODE_ENV = 'production'

  const env = loadEnv(options.mode, wpkPaths.envPath)

  await buildRenderer(env)
  await buildMain(env)
}

async function buildRenderer(env) {
  console.log(picocolors.yellow('building renderer'))
  const rsbuild = await createRsbuild({ rsbuildConfig: getRenderRsCfg(env) })
  await rsbuild.build()
}

function buildMain(env) {
  console.log(picocolors.yellow('building main'))

  const compiler = rspack(getMainWpkCfg(env))
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
