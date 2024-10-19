import { ipcMain, shell, clipboard } from 'electron'
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
}
