import { clipboard, globalShortcut, screen } from 'electron'

import { cachedSize, electronWindow } from './window'
import { SettingEvent } from '@common/mainRenderer/ipcEvent'

export const addShortcut = () => {
  globalShortcut.register('Alt+Space', () => {
    if (electronWindow.OpenDir.isVisible()) {
      electronWindow.OpenDir.hide()
    } else {
      const display = screen.getPrimaryDisplay()
      const { workArea } = display
      const bounds = electronWindow.OpenDir.getBounds()
      const x = Math.round(workArea.x + workArea.width / 2 - bounds.width / 2)
      electronWindow.OpenDir.setPosition(x, bounds.y)

      electronWindow.OpenDir.show()
    }
  })

  globalShortcut.register('Alt+v', () => {
    handleQuickInputWindow()
  })

  globalShortcut.register('Alt+r', () => {
    handleShowQrCode()
  })
}

function handleQuickInputWindow() {
  if (electronWindow.QuickInput.isVisible()) {
    electronWindow.QuickInput.hide()
  } else {
    const cursorCoord = screen.getCursorScreenPoint()

    const { width, height } = electronWindow.QuickInput.getBounds()
    const display = screen.getDisplayNearestPoint(cursorCoord)

    const { workArea } = display

    const x = Math.min(cursorCoord.x - 10, workArea.x + workArea.width - width)
    const y = Math.min(cursorCoord.y - 10, workArea.y + workArea.height - height)

    electronWindow.QuickInput.setBounds({ x, y, ...cachedSize })
    electronWindow.QuickInput.setAlwaysOnTop(true, 'screen-saver')
    electronWindow.QuickInput.show()
  }
}

function handleShowQrCode() {
  electronWindow.Setting.show()
  electronWindow.Setting.webContents.send(SettingEvent.Show_Qr_Code, clipboard.readText())
}
