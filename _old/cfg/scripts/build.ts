import getMainRpkCfg from '../rpk.main'
import getRenderRpkCfg from '../rpk.renderer'

import { loadEnv } from '../env'
import { createRsbuild, rspack } from '@rsbuild/core'
import { cleanDistDir } from '../utils'

export default async function build(options) {
  process.env.NODE_ENV = 'production'

  const { parsedWithProcess } = loadEnv(options.mode)

  cleanDistDir()

  await buildRenderer(parsedWithProcess)
  await buildMain(parsedWithProcess)
}

async function buildRenderer(env) {
  const rsbuild = await createRsbuild({ rsbuildConfig: getRenderRpkCfg(env) })
  await rsbuild.build()
}

function buildMain(env) {
  const compiler = rspack(getMainRpkCfg(env))
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
