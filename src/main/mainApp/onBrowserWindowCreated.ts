import { modifyFont } from './devtools'

export default function onBrowserWindowCreated(app: Electron.App) {
  app.on('browser-window-created', (_, window) => {
    // optimizer.watchWindowShortcuts(window)

    const { webContents } = window

    webContents.on('devtools-opened', () => {
      modifyFont(window)
    })

    webContents.on('before-input-event', (event, input) => {
      if (input.type === 'keyDown') {
        if (input.code === 'F5') {
          webContents.reloadIgnoringCache()
        }

        if (input.code === 'F12') {
          if (webContents.isDevToolsOpened()) {
            webContents.closeDevTools()
          } else {
            webContents.openDevTools({ mode: 'undocked' })
            console.log('Open dev tool...')
          }
        }

        if (input.code === 'Escape') {
          window.hide()
        }
      }
    })
  })
}
