import { is } from '@electron-toolkit/utils'
import { BrowserWindow, shell } from 'electron'
import path from 'node:path'
import { iconPath } from './iconPath'
import { url } from 'node:inspector'

type IElectronWindow = {
  Setting: BrowserWindow
  OpenDir: BrowserWindow
  QuickInput: BrowserWindow
  RmstBrowserWindow: BrowserWindow
  KillPort: BrowserWindow
}
export const electronWindow = {} as IElectronWindow

const preloadPath = path.join(__dirname, '../preload/index.js')

const loadWindow = (win: BrowserWindow, pathname: string) => {
  const baseUrl = is.dev ? process.env.Renderer_Url : path.join(__dirname, '../renderer/index.html')

  const uu = new URL(baseUrl)
  uu.hash = pathname
  const rendererUrl = uu.toString()

  if (is.dev) {
    win.loadURL(rendererUrl)
  } else {
    win.loadFile(rendererUrl)
  }
}

function createOpenDirWindow() {
  const win = new BrowserWindow({
    frame: false,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    center: true,
    resizable: false,
    // thickFrame: false, // 设置为 false 时将移除窗口的阴影和动画
    // transparent: true,
    useContentSize: true,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: true
    }
  })
  loadWindow(win, 'OpenDir')

  win.on('blur', () => {
    !is.dev && win.hide()
  })

  return win
}

function createSettingWindow() {
  const win = new BrowserWindow({
    icon: iconPath,
    skipTaskbar: false,
    show: false,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: true
    }
  })

  loadWindow(win, 'Setting')

  return win
}

function createQuickInputWindow() {
  const win = new BrowserWindow({
    frame: false,
    skipTaskbar: false,
    show: false,
    focusable: is.dev,
    resizable: false,
    width: 10,
    height: 10,
    alwaysOnTop: true,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: true
    }
  })

  loadWindow(win, 'QuickInput')

  return win
}

function createKillPortWindow() {
  const win = new BrowserWindow({
    icon: iconPath,
    skipTaskbar: false,
    show: false,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: true
    }
  })

  loadWindow(win, 'KillPort')

  return win
}

function createRmstBrowserWindow() {
  const win = new BrowserWindow({
    frame: false,
    width: 1300,
    height: 750,
    minWidth: 400,
    minHeight: 360,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: true,
      webviewTag: true
    }
  })

  win.on('maximize', () => {
    win.webContents.send('browser-size', true)
  })
  win.on('unmaximize', () => {
    win.webContents.send('browser-size', false)
  })

  win.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  win.webContents.on('did-attach-webview', (e, webContent) => {
    webContent.setWindowOpenHandler(details => {
      console.log(details)

      win.webContents.send('create-tab', details.url)

      return { action: 'deny' }
    })
  })

  loadWindow(win, 'rmstBrowser')

  return win
}

export default function createWindow() {
  electronWindow.Setting = createSettingWindow()
  electronWindow.OpenDir = createOpenDirWindow()
  electronWindow.QuickInput = createQuickInputWindow()
  electronWindow.KillPort = createKillPortWindow()

  if (is.dev) {
    // electronWindow.RmstBrowserWindow = createRmstBrowserWindow()
  }
}
