import { ipcMain, shell, clipboard, BrowserWindow } from 'electron'
import killPort from 'kill-port'

import { CommonEvent, KillPortEvent } from '@common/mainRenderer/ipcEvent'
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
}

const onCopy = createHandleListener(CommonEvent.Copy_Text)
const onOpenExternal = createHandleListener(CommonEvent.Open_External)

function addCommonIpcMain() {
  onCopy((_, content) => clipboard.writeText(content))
  onOpenExternal((_, url) => shell.openExternal(url))
}

function addKillPortIpcMain() {
  ipcMain.handle(KillPortEvent.Kill_Port, (_, value) => killPort(value))
  ipcMain.handle(KillPortEvent.Open_Url_Win, (_, value) => urlWin.open(value))
}

class UrlWin {
  map: Map<string, BrowserWindow> = new Map()

  open(url: string) {
    const win = this.map.get(url)
    if (win) {
      win.show()
      return
    }
    const newWin = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    })
    newWin.loadURL(url)
    this.map.set(url, newWin)
  }
}

const urlWin = new UrlWin()
