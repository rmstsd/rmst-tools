import { app, session } from 'electron'

// @electron-toolkit/utils

export const isDev = !app.isPackaged
export const isProd = app.isPackaged

export const platform = {
  isWindows: process.platform === 'win32',
  isMacOS: process.platform === 'darwin',
  isLinux: process.platform === 'linux'
}

const electronApp = {
  setAppUserModelId(id) {
    if (platform.isWindows) app.setAppUserModelId(isDev ? process.execPath : id)
  },
  setAutoLaunch(auto) {
    if (platform.isLinux) return false
    const isOpenAtLogin = () => {
      return app.getLoginItemSettings().openAtLogin
    }
    if (isOpenAtLogin() !== auto) {
      app.setLoginItemSettings({
        openAtLogin: auto,
        path: process.execPath
      })
      return isOpenAtLogin() === auto
    } else {
      return true
    }
  },
  skipProxy() {
    return session.defaultSession.setProxy({ mode: 'direct' })
  }
}
