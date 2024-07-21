// @ts-ignore
import electronmon from 'electronmon'
import WebpackDevServer from 'webpack-dev-server'
import { webpack } from 'webpack'
import picocolors from 'picocolors'

import webpackPaths from '../utils/wpk.paths'

import wpkRenderConfig from '../wpk.renderer.dev'
import mainConfig from '../wpk.main'
import preloadConfig from '../wpk.preload'

dev()

async function dev() {
  await runServer()
  // await buildMain()
  // await buildPreload()

  // await electronmon({
  //   cwd: webpackPaths.rootPath,
  //   patterns: ['!**/**', 'output/main/**']
  // })

  console.log(picocolors.green('✔ electron 应用启动'))
  console.log('')
}

const Port = 10000

async function runServer() {
  const compiler = webpack(wpkRenderConfig)
  const server = new WebpackDevServer({ port: Port }, compiler)

  console.log(picocolors.green(`Starting server...`))

  await server.start()

  console.log(picocolors.green(`渲染进程启动成功!`))
}

function buildMain() {
  console.log(picocolors.green('main start build'))

  const compiler = webpack(mainConfig)

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (!err) {
        resolve(undefined)
      }
    })
  })
}

export function buildPreload() {
  console.log(picocolors.green('preload start build'))

  const compiler = webpack(preloadConfig)

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (!err) {
        resolve(undefined)
      }
    })
  })
}
