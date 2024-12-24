import { createRsbuild, logger, rspack } from '@rsbuild/core'
import clearConsole from 'clear-console'

import { ChildProcess, spawn, spawnSync } from 'node:child_process'

import { Default_Port } from '../utils/constants'

import getRenderRpkCfg from '../rpk.renderer'
import getMainRpkCfg from '../rpk.main'
import { loadEnv } from '../env'
import { cleanDistDir, getElectronPath } from '../utils'

let rebuildCount = 0
let ps: ChildProcess

export default async function dev(options) {
  process.env.NODE_ENV = 'development'

  process.env.Port = String(Default_Port)
  process.env.Renderer_Url = `http://localhost:${Default_Port}`

  const { parsedWithProcess } = loadEnv(options.mode)

  cleanDistDir()

  spawnSync('chcp', ['65001'])
  await runServer(parsedWithProcess)
  await buildMain(parsedWithProcess)

  ps = startElectron()
}

function startElectron() {
  const electronPath = getElectronPath()
  const ps = spawn(electronPath, ['.'], { stdio: 'inherit' })

  ps.on('close', () => {
    console.log('ps close')
    process.exit()
  })
  ps.on('spawn', () => {
    logger.log('✔ electron 进程启动')
    logger.log('')
  })

  return ps
}

async function runServer(env) {
  const rsbuild = await createRsbuild({ rsbuildConfig: getRenderRpkCfg(env) })
  await rsbuild.startDevServer()
}

async function buildMain(env) {
  const compiler = rspack(getMainRpkCfg(env))
  return new Promise<void>((resolve, reject) => {
    compiler.watch({}, (err, stats) => {
      if (err || stats?.hasErrors()) {
        logger.error(`Error 主进程 compiler.watch`)
        logger.error(stats.toJson())
        reject()
        return
      }
      rebuildCount += 1
      if (ps) {
        clearConsole()
        ps.removeAllListeners()
        ps.kill()
        ps = startElectron()

        logger.greet(`\n ✔ 第 ${rebuildCount} 次构建`)
      }
      resolve()
    })
  })
}
