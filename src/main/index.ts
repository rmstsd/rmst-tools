import { app, BrowserWindow } from 'electron'
import bootstrap, { launchAtStartup } from './mainApp/bootstrap'
import { platform } from '@common/mainPreload/platform'

import './mainApp/htmlServer'
import onBrowserWindowCreated from './mainApp/onBrowserWindowCreated'
import { electronWindow } from './main-process/window'

console.log('主进程入口文件')
console.log(platform)
console.log(process.env.NODE_ENV ?? 'process.env.NODE_ENV 没有值')
console.log(process.env.Base_Url ?? 'process.env.Base_Url 没有值')
console.log(process.env.Release_Env ?? 'process.env.Release_Env 没有值')

app.whenReady().then(() => {
  console.log('app ready 启动')

  if (app.isPackaged) {
    launchAtStartup()
  }
  const http = require('http')

  const server = http.createServer((req, res) => {
    // 设置跨域请求头
    res.setHeader('Access-Control-Allow-Origin', '*') // 允许所有域名
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS') // 允许的方法
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type') // 允许的请求头

    // 处理预检请求
    if (req.method === 'OPTIONS') {
      res.writeHead(204) // 204 No Content
      res.end()
      return
    }

    if (req.method === 'POST') {
      let body = ''

      // 监听数据流
      req.on('data', chunk => {
        body += chunk.toString() // 将数据拼接成字符串
      })

      req.on('end', () => {
        // 处理接收到的数据
        console.log('Received data:', body)

        electronWindow.KillPort.webContents.send('log', body)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Data received', data: body }))
      })
    } else {
      res.writeHead(405, { 'Content-Type': 'text/plain' }) // 方法不允许
      res.end('Method Not Allowed')
    }
  })

  // 监听端口
  const PORT = 3485
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })

  onBrowserWindowCreated(app)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      bootstrap()
    }
  })
  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    // app.quit()
  } else {
    bootstrap()
  }
})

// Quit when all windows are closed, except on macOS. There, it's common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // app.quit()
  }
})
