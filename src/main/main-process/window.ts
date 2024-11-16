import { app, BrowserWindow, globalShortcut, screen } from 'electron'
import path from 'node:path'
import { iconPath } from './iconPath'
import { isDev, isProd } from '@main/constant'
import logger from '@main/logger'
import { platform } from '@common/mainPreload/platform'

type IElectronWindow = {
  Setting: BrowserWindow
  OpenDir: BrowserWindow
  QuickInput: BrowserWindow
  RmstBrowserWindow: BrowserWindow
  KillPort: BrowserWindow
  Todo: BrowserWindow
}

export const electronWindow = {} as IElectronWindow

const preloadPath = path.join(__dirname, './preload.js')

const loadWindow = (win: BrowserWindow, pathname: string) => {
  const baseUrl =
    isDev && process.env.Renderer_Url ? process.env.Renderer_Url : path.join(__dirname, '../renderer/index.html')

  if (isDev) {
    const uu = new URL(baseUrl)
    uu.hash = pathname
    const rendererUrl = uu.toString()
    win.loadURL(rendererUrl)
  } else {
    win.loadFile(baseUrl, { hash: pathname })
  }

  win.webContents.on(
    'did-fail-load',
    (evt, errorCode, errorDescription, validatedURL, isMainFrame, frameProcessId, frameRoutingId) => {
      const msg = { evt, errorCode, errorDescription, validatedURL, isMainFrame, frameProcessId, frameRoutingId }
      if (!isDev) {
        logger.error(msg)
      }
      console.error(msg)
    }
  )

  if (platform.isWindows) {
    win.hookWindowMessage(278, () => {
      win.setEnabled(false)
      win.setEnabled(true)
    })
  }
}

function createOpenDirWindow() {
  const win = new BrowserWindow({
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    center: true,
    resizable: false,
    // thickFrame: false, // 设置为 false 时将移除窗口的阴影和动画
    useContentSize: true,
    webPreferences: { preload: preloadPath }
  })
  loadWindow(win, 'OpenDir')

  win.on('blur', () => {
    isProd && win.hide()
  })

  return win
}

function createSettingWindow() {
  const win = new BrowserWindow({
    icon: iconPath,
    show: false,
    webPreferences: { preload: preloadPath }
  })

  loadWindow(win, 'Setting')

  return win
}

export const cachedSize = { width: 0, height: 0 }
function createQuickInputWindow() {
  const win = new BrowserWindow({
    frame: false,
    skipTaskbar: true,
    show: false,
    focusable: false,
    resizable: false,
    width: 100,
    height: 100,
    alwaysOnTop: true,
    maximizable: false,
    minimizable: false,
    webPreferences: { preload: preloadPath }
  })

  win.on('show', () => {
    globalShortcut.register('Esc', () => {
      win.hide()
    })
  })
  win.on('hide', () => {
    globalShortcut.unregister('Esc')
  })

  loadWindow(win, 'QuickInput')

  return win
}

function createKillPortWindow() {
  const win = new BrowserWindow({
    icon: iconPath,
    show: false,
    webPreferences: { preload: preloadPath }
  })

  loadWindow(win, 'KillPort')

  return win
}

function createTodoWindow() {
  const pd = screen.getPrimaryDisplay()
  const win = new BrowserWindow({
    frame: false,
    skipTaskbar: true,
    maximizable: false,
    minimizable: false,
    x: pd.workArea.width - 200,
    y: 0,
    width: 200,
    height: 300,
    transparent: true,
    webPreferences: { preload: preloadPath }
  })

  // loadWindow(win, 'Todo')

  return win
}

export default function createWindow() {
  electronWindow.Setting = createSettingWindow()
  electronWindow.OpenDir = createOpenDirWindow()
  electronWindow.QuickInput = createQuickInputWindow()
  electronWindow.KillPort = createKillPortWindow()
  electronWindow.Todo = createTodoWindow()
}
