import { app, BrowserWindow } from 'electron'
import bootstrap, { launchAtStartup } from './mainApp/bootstrap'
import { platform } from '@common/mainPreload/platform'

import onBrowserWindowCreated from './mainApp/onBrowserWindowCreated'

console.log('主进程入口文件')
console.log(platform)
console.log(process.env.NODE_ENV ?? 'process.env.NODE_ENV 没有值')
console.log(process.env.Base_Url ?? 'process.env.Base_Url 没有值')
console.log(process.env.Release_Env ?? 'process.env.Release_Env 没有值')

app.whenReady().then(() => {
  console.log('app ready 启动')

  if (app.isPackaged) {
    // launchAtStartup()
  }

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
