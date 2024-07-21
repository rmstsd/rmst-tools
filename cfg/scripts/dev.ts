import electronmon from 'electronmon'
import WebpackDevServer from 'webpack-dev-server'
import { webpack } from 'webpack'
import picocolors from 'picocolors'

import webpackPaths from '../utils/wpk.paths'

import wpkRenderConfig from '../wpk.renderer.dev'
import mainConfig from '../wpk.main'
import preloadConfig from '../wpk.preload'

import { Default_Port } from '../utils/constants'

process.env.Port = String(Default_Port)
process.env.Renderer_Url = `http://localhost:${Default_Port}`

dev()

async function dev() {
  await runServer()
  await buildPreload()
  await buildMain()

  await electronmon({
    cwd: webpackPaths.rootPath,
    patterns: ['!**/**', 'out/main/**']
  })

  console.log(picocolors.green('✔ electron 应用启动'))
  console.log('')
}

async function runServer() {
  const compiler = webpack(wpkRenderConfig)
  const server = new WebpackDevServer(
    {
      port: process.env.Port,
      client: { overlay: false }
    },
    compiler
  )

  console.log(picocolors.green(`Starting server...`))

  await server.start()

  console.log(picocolors.green(`渲染进程启动成功!`))
}

function buildMain() {
  console.log(picocolors.green('主进程开始 build'))

  const compiler = webpack(mainConfig)
  return new Promise<void>((resolve, reject) => {
    compiler.watch({ ignored: ['**/node_modules'] }, (err, stats) => {
      if (err || stats?.hasErrors()) {
        console.log(picocolors.red('Error 主进程 compiler.watch'))
        console.log(stats?.toString({ colors: true }))

        reject()
        return
      }

      resolve()
    })
  })
}

export function buildPreload() {
  console.log(picocolors.green('preload 开始 build'))

  const compiler = webpack(preloadConfig)
  return new Promise<void>((resolve, reject) => {
    compiler.watch({ ignored: ['**/node_modules'] }, (err, stats) => {
      if (err || stats?.hasErrors()) {
        console.log(picocolors.red('Error preload compiler.watch'))
        console.log(stats?.toString({ colors: true }))
        reject()
        return
      }

      resolve()
    })
  })
}
