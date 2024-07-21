import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import pc from 'picocolors'

import webpackConfig from '../wpk.renderer.dev'
import { clearConsole } from '../utils'

const Port = 10000

export const runServer = async () => {
  const compiler = webpack(webpackConfig)
  const server = new WebpackDevServer({ port: Port }, compiler)

  console.log(pc.green(`Starting server...`))

  await server.start()

  clearConsole()

  console.log(pc.green(`渲染进程启动成功!`))
}
