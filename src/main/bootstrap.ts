import { Menu, app } from 'electron'

import { createTray } from './main-process/createTray'
import createWindow from './main-process/electronWindow'
import { addIpcMain } from './main-process/ipcMain'
import { addShortcut } from './main-process/uiohook'

export default function bootstrap() {
  addIpcMain()
  Menu.setApplicationMenu(null)

  createWindow()

  createTray()

  addShortcut()
}

export function launchAtStartup() {
  app.setLoginItemSettings({ openAtLogin: true })
}
