import { app, BrowserWindow } from 'electron'
import { optimizer } from '@electron-toolkit/utils'

import bootstrap, { launchAtStartup } from './bootstrap'
import { modifyFont } from './devtools'

console.log('主进程入口文件')

app.whenReady().then(() => {
  console.log('app ready 启动')

  if (app.isPackaged) {
    launchAtStartup()
  }

  // Set app user model id for windows
  // electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development  and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)

    window.webContents.on('devtools-opened', () => {
      modifyFont(window)
    })

    window.on('close', evt => {
      evt.preventDefault()
      window.hide()
    })

    window.webContents.on('before-input-event', (event, input) => {
      if (input.type === 'keyDown') {
        if (input.code === 'F5') {
          window.webContents.reloadIgnoringCache()
        }

        if (input.code === 'Escape') {
          window.hide()
        }
      }
    })
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      // createWindow()

      bootstrap()
    }
  })
  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    app.quit()
  } else {
    bootstrap()
  }
})

// Quit when all windows are closed, except on macOS. There, it's common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
