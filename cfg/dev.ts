// @ts-ignore
import electronmon from 'electronmon'
import webpackPaths from './webpack.paths'
import { runServer } from './dev.renderer'
import { buildMain } from './dev.main'
import picocolors from 'picocolors'

dev()

async function dev() {
  await runServer()

  await buildMain()

  await electronmon({
    cwd: webpackPaths.rootPath,
    patterns: ['!**/**', 'out/main/**']
  })

  console.log(picocolors.green('electron 应用启动'))
}
