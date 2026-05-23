import { app, globalShortcut } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { registerIpcHandlers } from './ipc'
import { initStore } from './store'
import {
  createManagedWindows,
  createTray,
  openManagedWindow,
  toggleOpenFolderWindow,
  toggleQuickInputWindow,
  quitApp
} from './windows'
import { cleanupSelectionHook, openExplorerFromSelection, showQrCodeFromSelection } from './system'

const gotSingleInstanceLock = app.requestSingleInstanceLock()

if (!gotSingleInstanceLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    openManagedWindow('setting')
  })

  app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.rmst-toolkit.app')

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    if (!is.dev && process.platform === 'win32') {
      app.setLoginItemSettings({
        openAtLogin: true,
        args: ['--flag1', '--flag2']
      })
    }

    initStore()
    registerIpcHandlers()
    createManagedWindows()
    createTray()
    registerGlobalShortcuts()

    app.on('activate', () => {
      openManagedWindow('setting')
    })
  })
}

app.on('will-quit', () => {
  cleanupSelectionHook()
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    return
  }
})

function registerGlobalShortcuts(): void {
  globalShortcut.register('Alt+Space', () => {
    toggleOpenFolderWindow()
  })

  globalShortcut.register('Alt+V', () => {
    toggleQuickInputWindow()
  })

  globalShortcut.register('Alt+R', () => {
    void showQrCodeFromSelection()
  })

  globalShortcut.register('Alt+E', () => {
    void openExplorerFromSelection()
  })
}

process.on('SIGTERM', () => {
  quitApp()
})
