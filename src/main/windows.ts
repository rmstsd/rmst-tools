import { app, BrowserWindow, Menu, nativeImage, screen, shell, Tray } from 'electron'
import type { BrowserWindowConstructorOptions, WebContents } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'node:path'
import icon from '../../resources/icon.png?asset'
import { STORE_KEYS, getStoreValue, setStoreValue } from './store'
import type { ManagedWindowKey } from './types'

const managedWindows = new Map<ManagedWindowKey, BrowserWindow>()
let tray: Tray | null = null
let trayContextMenu: Menu | null = null
let allowClose = false

export function createManagedWindows(): void {
  createManagedWindow('setting', {
    title: '设置',
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true
  })

  createManagedWindow('openFolder', {
    width: 800,
    height: 300,
    show: false,
    resizable: false,
    frame: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    autoHideMenuBar: true
  })

  createManagedWindow('quickInput', {
    width: 400,
    height: 200,
    show: false,
    focusable: false,
    resizable: false,
    maximizable: false,
    minimizable: false,
    frame: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    autoHideMenuBar: true
  })
}

export function getManagedWindow(key: ManagedWindowKey): BrowserWindow | undefined {
  return managedWindows.get(key)
}

export function openManagedWindow(key: ManagedWindowKey): BrowserWindow {
  const window = mustGetWindow(key)

  if (window.isMinimized()) {
    window.restore()
  }

  window.show()
  window.focus()
  return window
}

export function hideWindowByKey(key: ManagedWindowKey): void {
  managedWindows.get(key)?.hide()
}

export function hideWindowForWebContents(webContents: WebContents): void {
  const window = BrowserWindow.fromWebContents(webContents)
  window?.hide()
}

export function setWindowSizeForWebContents(webContents: WebContents, width?: number, height?: number): void {
  const window = BrowserWindow.fromWebContents(webContents)
  if (!window) {
    return
  }

  const [currentWidth, currentHeight] = window.getContentSize()
  window.setContentSize(Math.ceil(width ?? currentWidth), Math.ceil(height ?? currentHeight))
}

export function toggleOpenFolderWindow(): void {
  const window = mustGetWindow('openFolder')

  if (window.isVisible() && window.isFocused()) {
    window.hide()
    return
  }

  positionOpenFolderWindow(window)
  window.show()
  window.focus()
}

export function toggleQuickInputWindow(): void {
  const window = mustGetWindow('quickInput')

  if (window.isVisible()) {
    window.hide()
    return
  }

  positionQuickInputWindow(window)
  window.show()
}

export function createTray(): void {
  const trayIcon = nativeImage.createFromPath(icon)
  trayContextMenu = Menu.buildFromTemplate([
    {
      id: 'setting',
      label: '设置',
      click: () => {
        openManagedWindow('setting')
      }
    },
    { type: 'separator' },
    {
      id: 'restart',
      label: '重启',
      click: () => {
        relaunchApp()
      }
    },
    {
      id: 'quit',
      label: '退出',
      click: () => {
        quitApp()
      }
    }
  ])

  tray = new Tray(trayIcon)
  tray.setToolTip('rmst-toolkit')
  tray.setContextMenu(trayContextMenu)

  tray.on('click', () => {
    openManagedWindow('setting')
  })
}

export function openExternalWindow(url: string): void {
  const normalizedUrl = normalizeUrl(url)
  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'rmst-tools',
    icon,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  window.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  window.webContents.on('page-title-updated', (event, title) => {
    event.preventDefault()
    window.setTitle(title)
  })

  void window.loadURL(normalizedUrl)
  appendHistoryUrl(normalizedUrl)
}

export function getHistoryOpenedUrls(): string[] {
  return getStoreValue<string[]>(STORE_KEYS.historyOpenedUrls, [])
}

export function clearHistoryOpenedUrls(): void {
  setStoreValue(STORE_KEYS.historyOpenedUrls, [])
}

export function quitApp(): void {
  allowClose = true
  app.quit()
}

export function relaunchApp(): void {
  allowClose = true
  app.relaunch()
  app.exit(0)
}

function createManagedWindow(key: ManagedWindowKey, options: BrowserWindowConstructorOptions): void {
  const window = new BrowserWindow({
    icon,
    ...options,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  managedWindows.set(key, window)
  loadManagedRoute(window, key)

  window.on('close', event => {
    if (allowClose) {
      return
    }

    event.preventDefault()
    window.hide()
  })

  window.on('focus', () => {
    window.webContents.send('window-focus-changed', true)
  })

  window.on('blur', () => {
    window.webContents.send('window-focus-changed', false)
  })

  window.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
}

function loadManagedRoute(window: BrowserWindow, key: ManagedWindowKey): void {
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    void window.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/#${key}`)
    return
  }

  void window.loadFile(join(__dirname, '../renderer/index.html'), { hash: key })
}

function positionOpenFolderWindow(window: BrowserWindow): void {
  const display = screen.getPrimaryDisplay()
  const [width] = window.getSize()
  const x = Math.round(display.workArea.x + display.workArea.width / 2 - width / 2)
  const y = Math.round(display.workArea.y + display.workArea.height / 4)

  window.setPosition(x, y)
}

function positionQuickInputWindow(window: BrowserWindow): void {
  const cursor = screen.getCursorScreenPoint()
  const display = screen.getDisplayNearestPoint(cursor)
  const [width, height] = window.getSize()
  let x = cursor.x
  let y = cursor.y

  if (x + width > display.workArea.x + display.workArea.width) {
    x -= width
  }

  if (y + height > display.workArea.y + display.workArea.height) {
    y -= height
  }

  window.setPosition(Math.round(x), Math.round(y))
}

function appendHistoryUrl(url: string): void {
  const history = getHistoryOpenedUrls()

  if (!history.includes(url)) {
    history.unshift(url)
  }

  setStoreValue(STORE_KEYS.historyOpenedUrls, history.slice(0, 5))
}

function normalizeUrl(url: string): string {
  if (/^(https?:|file:)/i.test(url)) {
    return url
  }

  return `https://${url}`
}

function mustGetWindow(key: ManagedWindowKey): BrowserWindow {
  const window = managedWindows.get(key)

  if (!window) {
    throw new Error(`窗口未创建：${key}`)
  }

  return window
}
