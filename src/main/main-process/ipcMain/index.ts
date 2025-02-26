import { ipcMain, shell, clipboard, BrowserWindow, nativeImage } from 'electron'
import killPort from 'kill-port'

import { CommonEvent, KillPortEvent } from '@common/mainRenderer/ipcEvent'
import { addSettingIpcMain } from './settingIpcMain'
import { addQuickInputIpcMain } from './quickInputIpcMain'
import { addQuickOpenDirIpcMain, getProjectNamesTree } from './quickOpenDirIpcMain'

import { createHandleListener, networkImageToBuffer } from './utils'
import path from 'path'
import { existsSync } from 'fs-extra'
import { exec } from 'child_process'
import { iconPath } from '../iconPath'
import { getStoreSetting, setStoreSetting } from '@main/store'

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
  ipcMain.handle(KillPortEvent.Set_Git_Ignorecase, (_, value) => setGitIgnorecase(value))
}

class UrlWin {
  map: Map<string, BrowserWindow> = new Map()

  async open(url: string) {
    const win = this.map.get(url)
    if (win) {
      win.show()
      return
    }

    const newWin = new BrowserWindow({
      icon: iconPath,
      width: 1300,
      height: 800,
      webPreferences: {
        nodeIntegration: true
      }
    })
    newWin.loadURL(url)
    newWin.once('closed', () => this.map.delete(url))

    newWin.webContents.on('page-favicon-updated', async (evt, favicons) => {
      const [favicon] = favicons
      if (favicon) {
        const buffer = await networkImageToBuffer(favicon)
        newWin.setIcon(nativeImage.createFromBuffer(buffer))
      }
    })

    this.map.set(url, newWin)

    const store = getStoreSetting()
    const historyOpenedUrls = store.historyOpenedUrls ?? []
    if (historyOpenedUrls.includes(url)) {
      return
    }
    if (historyOpenedUrls.length > 5) {
      historyOpenedUrls.pop()
    }
    historyOpenedUrls.unshift(url)

    setStoreSetting({ ...store, historyOpenedUrls })
  }
}

const urlWin = new UrlWin()

function setGitIgnorecase(value: boolean) {
  const te = getProjectNamesTree().reduce(
    (acc, item) => acc.concat(item.children.map(p => path.join(item.name, p))),
    []
  )

  const gitRepos = te.filter(item => {
    return existsSync(path.join(item, '.git'))
  })

  return Promise.all(
    gitRepos.map(item => {
      return new Promise(resolve => {
        const pc = exec(`git config core.ignorecase ${value}`, { cwd: item })
        pc.on('exit', () => {
          resolve(undefined)
        })
      })
    })
  )
}
