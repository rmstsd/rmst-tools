import { app, globalShortcut } from 'electron'
import { electronApp, is } from '@electron-toolkit/utils'
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
import onBrowserWindowCreated from './onBrowserWindowCreated'
import { cleanupCaretHelper } from './koff'
import { startWindowsVolumeListener, stopWindowsVolumeListener } from './loudness-listener'
import { hideDefaultVolumeOsd, restoreDefaultVolumeOsd } from './volumeOsd'

const gotSingleInstanceLock = app.requestSingleInstanceLock()

if (!gotSingleInstanceLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    openManagedWindow('setting')
  })

  app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.rmst-toolkit.app')

    if (!is.dev && process.platform === 'win32') {
      app.setLoginItemSettings({
        openAtLogin: true,
        args: ['--flag1', '--flag2']
      })
    }

    onBrowserWindowCreated(app)

    initStore()
    registerIpcHandlers()
    createManagedWindows()
    startWindowsVolumeListener()
    hideDefaultVolumeOsd()
    createTray()
    registerGlobalShortcuts()

    app.on('activate', () => {
      openManagedWindow('setting')
    })
  })
}

app.on('will-quit', () => {
  restoreDefaultVolumeOsd()
  cleanupCaretHelper()
  stopWindowsVolumeListener()
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

process.once('exit', () => {
  restoreDefaultVolumeOsd()
})
