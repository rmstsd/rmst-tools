import picocolors from 'picocolors'
import { webpack } from 'webpack'

import wpkRendererProd from '../wpk.renderer.prod'
import wpkMainProdConfig from '../wpk.main.prod'

process.env.NODE_ENV = 'production'

export async function build() {
  await buildRenderer()
  await buildMain()
}

function buildRenderer() {
  console.log(picocolors.yellow('building renderer'))
  const compiler = webpack(wpkRendererProd)
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

function buildMain() {
  console.log(picocolors.yellow('building main'))
  const compiler = webpack(wpkMainProdConfig)
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
