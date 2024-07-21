import { app, BrowserWindow } from 'electron'
import path from 'node:path'

console.log(app.isPackaged)
console.log(process.env.NODE_ENV)

const preloadPath = path.join(__dirname, '../preload/index.js')

app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: { preload: preloadPath }
  })

  win.loadURL('http://localhost:10000/')
})

app.on('browser-window-created', (_, window) => {
  const { webContents } = window

  webContents.on('before-input-event', (evt, input) => {
    if (input.code === 'F12') {
      if (webContents.isDevToolsOpened()) {
        webContents.closeDevTools()
      } else {
        webContents.openDevTools({ mode: 'undocked' })
      }
    }
    if (input.code == 'F5') {
      webContents.reloadIgnoringCache()
    }
  })
})
