import { loadEnv, createRsbuild, rspack } from '@rsbuild/core'
import clearConsole from 'clear-console'

import picocolors from 'picocolors'
import { ChildProcess, spawn, spawnSync } from 'node:child_process'

import getMainWpkCfg from '../wpk.main'

import { Default_Port } from '../utils/constants'
import { getElectronPath } from '../utils/getElectronPath'
import { loadEnv as oldLoadEnv } from '../env'
import wpkPaths from '../utils/wpk.paths'
import { getRenderRsCfg } from '../wpk.renderer'

let rebuildCount = 0
let ps: ChildProcess

export async function dev(options) {
  process.env.NODE_ENV = 'development'

  process.env.Port = String(Default_Port)
  process.env.Renderer_Url = `http://localhost:${Default_Port}`

  const ooo = oldLoadEnv(options.mode, wpkPaths.envPath)
  const env = Object.keys(ooo).reduce((acc, item) => {
    return { ...acc, [`process.env.${item}`]: JSON.stringify(ooo[item]) }
  }, {})

  spawnSync('chcp', ['65001'])
  await runServer(env)
  await buildMain(env)

  ps = startElectron()

  console.log(picocolors.green('✔ electron 应用启动'))
  console.log('')
}

function startElectron() {
  const electronPath = getElectronPath()
  const ps = spawn(electronPath, ['.'], { stdio: 'inherit' })

  ps.on('close', () => {
    console.log('ps close')
    process.exit()
  })

  return ps
}

async function runServer(env) {
  const rsbuild = await createRsbuild({ rsbuildConfig: getRenderRsCfg(env) })
  await rsbuild.startDevServer({})

  console.log(picocolors.green(`渲染进程启动成功!`))
}

async function buildMain(env) {
  console.log(picocolors.green('主进程开始 build'))

  const compiler = rspack(getMainWpkCfg(env))
  return new Promise<void>((resolve, reject) => {
    compiler.watch({}, (err, stats) => {
      if (err || stats?.hasErrors()) {
        console.log(picocolors.red('Error 主进程 compiler.watch'))
        console.log(stats?.toString({ colors: true }))
        reject()
        return
      }
      rebuildCount += 1
      if (ps) {
        clearConsole()
        ps.removeAllListeners()
        ps.kill()
        ps = startElectron()
        console.log(picocolors.green(`\n ✔ 第 ${rebuildCount} 次构建`))
      }
      resolve()
    })
  })
}
