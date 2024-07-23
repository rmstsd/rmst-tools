import electronmon from 'electronmon'
import WebpackDevServer from 'webpack-dev-server'
import { webpack } from 'webpack'
import picocolors from 'picocolors'
import clearConsole from 'clear-console'

import wpkPaths from '../utils/wpk.paths'

import getRendererWpkCfg from '../wpk.renderer.dev'
import getMainWpkCfg from '../wpk.main'
import getPreloadWpkCfg from '../wpk.preload'

import { Default_Port } from '../utils/constants'
import spawn from 'cross-spawn'

process.env.NODE_ENV = 'development'
process.env.Port = String(Default_Port)
process.env.Renderer_Url = `http://localhost:${Default_Port}`

dev()

let app

async function dev() {
  await runServer()
  await buildPreload()
  await buildMain()

  spawn('electron', ['.'])

  // app = await electronmon({
  //   cwd: wpkPaths.rootPath,
  //   patterns: ['!**/**', 'out/main/**']
  // })

  console.log(picocolors.green('✔ electron 应用启动'))
  console.log('')
}

async function runServer() {
  const compiler = webpack(getRendererWpkCfg(process.env.NODE_ENV))
  const server = new WebpackDevServer(
    {
      port: process.env.Port,
      client: { overlay: false },
      hot: true
    },
    compiler
  )

  console.log(picocolors.green(`Starting server...`))

  await server.start()

  console.log(picocolors.green(`渲染进程启动成功!`))
}

function buildMain() {
  console.log(picocolors.green('主进程开始 build'))

  const compiler = webpack(getMainWpkCfg())
  return new Promise<void>((resolve, reject) => {
    compiler.watch({ ignored: ['**/node_modules'] }, (err, stats) => {
      if (err || stats?.hasErrors()) {
        console.log(picocolors.red('Error 主进程 compiler.watch'))
        console.log(stats?.toString({ colors: true }))

        reject()
        return
      }

      if (app) {
        console.log(picocolors.green('二次构建'))
        app.restart()
      }

      resolve()
    })
  })
}

export function buildPreload() {
  console.log(picocolors.green('preload 开始 build'))

  const compiler = webpack(getPreloadWpkCfg())
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
