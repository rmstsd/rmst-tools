import Webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import pc from 'picocolors'

import webpackConfig from './wpk.renderer.dev'

const Port = 10000

const compiler = Webpack(webpackConfig)
const server = new WebpackDevServer({ port: Port }, compiler)

export const runServer = async () => {
  console.log(pc.green(`Starting server...`))

  await server.start()

  console.log(pc.green(`渲染进程启动成功!`))
}
