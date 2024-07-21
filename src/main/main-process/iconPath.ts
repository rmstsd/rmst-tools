import { app } from 'electron'
import path from 'path'

const iconsPath = path.join(app.getAppPath(), '/resources/icons')

function getTrayIcon() {
  if (process.platform !== 'darwin') {
    return path.join(iconsPath, 'win/icon.ico')
  }

  return path.join(iconsPath, 'icon.png')
}

export const iconPath = getTrayIcon()
