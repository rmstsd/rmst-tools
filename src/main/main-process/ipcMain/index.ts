import { ipcMain, shell, clipboard } from 'electron'
import killPort from 'kill-port'

import { electronWindow } from '../../main-process/electronWindow'
import { BrowserEvent, CommonEvent, KillPortEvent } from '@common/ipcEvent'
import { addSettingIpcMain } from './settingIpcMain'
import { addQuickInputIpcMain } from './quickInputIpcMain'
import { addQuickOpenDirIpcMain } from './quickOpenDirIpcMain'

import { createHandleListener } from './utils'

export const addIpcMain = () => {
  addCommonIpcMain()
  addQuickOpenDirIpcMain()
  addQuickInputIpcMain()
  addSettingIpcMain()
  addKillPortIpcMain()

  // addBrowserIpcMain()
}

const onCopy = createHandleListener(CommonEvent.Copy_Text)
const onOpenExternal = createHandleListener(CommonEvent.Open_External)

function addCommonIpcMain() {
  onCopy((_, content) => clipboard.writeText(content))
  onOpenExternal((_, url) => shell.openExternal(url))
}

function addKillPortIpcMain() {
  ipcMain.handle(KillPortEvent.Kill_Port, (_, value) => killPort(value))
}

function addBrowserIpcMain() {
  ipcMain.handle(BrowserEvent.Browser_Minimize, () => electronWindow.RmstBrowserWindow.minimize())
  ipcMain.handle(BrowserEvent.Browser_Maximize, () => electronWindow.RmstBrowserWindow.maximize())
  ipcMain.handle(BrowserEvent.Browser_Unmaximize, () => electronWindow.RmstBrowserWindow.unmaximize())
  ipcMain.handle(BrowserEvent.Browser_Close, () => electronWindow.RmstBrowserWindow.close())
}
